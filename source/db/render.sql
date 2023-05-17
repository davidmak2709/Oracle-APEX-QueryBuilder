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
    l_plsql_fetch_proc                  p_region.attribute_01%type := p_region.attribute_01;
    l_plsql_fetch_proc_expr_var         p_region.attribute_02%type := trim(p_region.attribute_02);
    l_plsql_fetch_proc_json_var         p_region.attribute_03%type := trim(p_region.attribute_03);
    --
    
    l_plsql_parameters  apex_exec.t_parameters;
    l_filters_values    apex_json.t_values;

    l_expression    varchar2(32767);
    l_json          clob;

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

    if apex_application.g_debug and substr(:DEBUG,6) >= 6
    then
        apex_debug.info('Expression varibale name: '||l_plsql_fetch_proc_expr_var);
        apex_debug.info('JSON varibale name: '      ||l_plsql_fetch_proc_json_var);           
    end if;

    apex_exec.add_parameter(l_plsql_parameters, l_plsql_fetch_proc_expr_var, to_char(null));
    apex_exec.add_parameter(l_plsql_parameters, l_plsql_fetch_proc_json_var, to_char(null));
    
    apex_exec.execute_plsql
    (
        p_plsql_code      => l_plsql_fetch_proc,
        p_auto_bind_items => false,
        p_sql_parameters  => l_plsql_parameters 
    );

    l_expression := apex_exec.get_parameter_varchar2
    ( 
        p_parameters => l_plsql_parameters,
        p_name       => l_plsql_fetch_proc_expr_var
    );

    l_json := apex_exec.get_parameter_varchar2
    ( 
        p_parameters => l_plsql_parameters,
        p_name       => l_plsql_fetch_proc_json_var
    );
    
            
    if apex_application.g_debug and substr(:DEBUG,6) >= 6
    then
        apex_debug.info('Expression: '||l_expression);
        apex_debug.info('JSON: '||l_json);
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
    IF l_expression IS NOT NULL THEN
        apex_json.write('expression'    , l_expression);
    END IF;
    --
    IF l_json IS NOT NULL THEN
        apex_json.parse(l_filters_values, l_json); 
        apex_json.write('filters', l_filters_values, '.');
    END IF;
    --
    IF apex_application.g_x01 IS NOT NULL THEN
        apex_json.write('errorMessage', apex_application.g_x01);
    END IF;
    apex_json.close_all;
    
	--add lang file
	apex_javascript.add_library 
	(
    	p_name                    => 'query-builder.'||'en', -- param
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