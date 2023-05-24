function render
  ( p_region              in apex_plugin.t_region
  , p_plugin              in apex_plugin.t_plugin
  , p_is_printer_friendly in boolean
  )
return apex_plugin.t_region_render_result
as
    l_result                  apex_plugin.t_region_render_result;

    l_ajax_id           varchar2(4000)             := apex_plugin.get_ajax_identifier;
    l_region_id         p_region.static_id%type    := nvl(p_region.static_id, p_region.id);
    l_init_js           varchar2(32767)            := nvl(apex_plugin_util.replace_substitutions(p_region.init_javascript_code), 'undefined');
    
    --
    l_plsql_fetch_proc                  p_region.attribute_01%type := trim(p_region.attribute_01);
  	l_plugins 							p_region.attribute_07%type := trim(p_region.attribute_07);
	l_export_format 					p_region.attribute_08%type := trim(p_region.attribute_08);
    
    l_plsql_parameters  apex_exec.t_parameters;
    l_filters_values    apex_json.t_values;

    c_plugin_css_prefix constant varchar2(100) := 'll-query-builder';
begin        
    --debug
    if apex_application.g_debug and substr(:DEBUG,6) >= 6
    then
        apex_plugin_util.debug_region
            ( p_plugin => p_plugin
            , p_region => p_region
            );
    end if;
   
    apex_exec.execute_plsql
    (
        p_plsql_code      => l_plsql_fetch_proc,
        p_auto_bind_items => false,
        p_sql_parameters  => l_plsql_parameters 
    );

    if apex_application.g_debug and substr(:DEBUG,6) >= 6
    then
        apex_debug.info('Expression: '||apex_application.g_x01);
        apex_debug.info('JSON: '||apex_application.g_clob_01);
    end if;

    -- region container
    sys.htp.p('<div class="'||c_plugin_css_prefix||'-container">');

    -- slider main container close
    sys.htp.p('</div>');


    --creating json
    apex_json.initialize_clob_output;
    apex_json.open_object;
    apex_json.write('regionId'      , to_char(l_region_id));
    apex_json.write('pluginAjaxId'  , l_ajax_id);
	--
    IF apex_application.g_x01 IS NOT NULL THEN
        apex_json.write('expression'    , apex_application.g_x01);
    END IF;
    --
    IF apex_application.g_clob_01 IS NOT NULL THEN
        apex_json.parse(l_filters_values, apex_application.g_clob_01); 
        apex_json.write('filters', l_filters_values, '.');
    END IF;
    --
    IF apex_application.g_x02 IS NOT NULL THEN
        apex_json.write('errorMessage', apex_application.g_x02);
    END IF;
	--
	IF l_export_format IS NOT NULL AND l_export_format <> 'false' THEN
		apex_json.write('exportFormat', l_export_format);
	END IF;
	--
	apex_json.open_array('plugins');
	IF l_plugins IS NOT NULL THEN
		FOR i IN (SELECT LOWER(REPLACE(COLUMN_VALUE, '_','-')) name FROM TABLE(apex_string.split(l_plugins,':'))) LOOP
    		apex_json.write(i.name);
		END LOOP;
	END IF;
	apex_json.close_array;
	--
    apex_json.close_all;
    
	--add lang file
	apex_javascript.add_library 
	(
    	p_name                    => 'query-builder.'||NVL(apex_application.g_browser_language, 'en'),
    	p_directory               => p_plugin.file_prefix||'i18n/'
	);   
    --onload code
    apex_javascript.add_onload_code
    (
        p_code => 'LL.region.queryBuilder.initBuilder(' || apex_json.get_clob_output || ', '|| l_init_js ||');'
    );

    apex_json.free_output;

    return l_result;
end;