function ajax
  ( p_region in apex_plugin.t_region
  , p_plugin in apex_plugin.t_plugin
  )
return apex_plugin.t_region_ajax_result
as  
    l_result apex_plugin.t_region_ajax_result;

    l_plsql_submit_proc                  p_region.attribute_04%type := p_region.attribute_04;

    l_on_success_redirect_page p_region.attribute_06%type := p_region.attribute_06;

    l_status    varchar2(4000);
    l_message   varchar2(4000);

    b_status boolean;

    l_plsql_parameters  apex_exec.t_parameters;

begin
    if apex_application.g_debug
    then
        apex_debug.enable;
        apex_debug.info(apex_application.g_x01);
    end if;

    apex_exec.execute_plsql
    (
        p_plsql_code      => l_plsql_submit_proc,
        p_auto_bind_items => false,
        p_sql_parameters  => l_plsql_parameters 
    );

    b_status    := apex_application.g_x03 IS NULL;
    l_message   := apex_application.g_x03;

    -- creating the JSON
    apex_json.initialize_clob_output;
    apex_json.open_object;
    apex_json.write('status', b_status);
    apex_json.write('message', l_message);
    
    if l_on_success_redirect_page is not null and b_status
    then 
        apex_json.write('redirect', APEX_UTIL.PREPARE_URL(
            p_url => 'f?p=' || v('APP_ID') || ':'||l_on_success_redirect_page||':'||v('APP_SESSION')
        ));
    end if;

    apex_json.close_object;
    
    -- send it back to the frontend
    sys.htp.p(apex_json.get_clob_output);

    apex_json.free_output;
    return l_result;
end ajax;
