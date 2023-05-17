/* globals apex,$ */
window.LL = window.LL || {};
LL.region = LL.region || {};
LL.region.queryBuilder = LL.region.queryBuilder || {};


LL.region.queryBuilder.initBuilder = function (config, initJs) {
    apex.debug.info('LL - Query Builder: ', config);

    // execute the initJs function
    if (initJs && typeof initJs == 'function') {
        initJs.call(this, config);
    }

    const CSS_PREFIX = 'll-query-builder';

    let regionId = config.regionId;

    let regionEl = document.querySelector(`#${regionId}`);
    let queryBuilderElement = regionEl.querySelector(`.${CSS_PREFIX}-container`);

    // functions
    function setRulesFromSQL(sql) {
        $(queryBuilderElement).queryBuilder('setRulesFromSQL', sql);
    }

    function getSQL() {
        return $(queryBuilderElement).queryBuilder('getSQL').sql;
    }

    function submit() {
        apex.server.plugin(
            config.pluginAjaxId,
            {
                x01: getSQL()
            },
            {
                dataType: 'json',
                success: function (jsonData) {
                    if (apex.debug.getLevel() != apex.debug.LOG_LEVEL.OFF) {
                        apex.debug.info(`${CSS_PREFIX} jsonData: ${JSON.stringify(jsonData)}`);
                    }

                    if (typeof jsonData.status == 'boolean' && !jsonData.status) {
                        apex.message.showErrors([{
                            type: 'error',
                            location: 'page',
                            message: jsonData.message,
                            unsafe: false
                        }]);
                    }

                    if (typeof jsonData.redirect == 'string') {
                        eval(jsonData.redirect);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    if (apex.debug.getLevel() != apex.debug.LOG_LEVEL.OFF) {
                        apex.debug.error(`${CSS_PREFIX} ajaxOptions: ${ajaxOptions}`);
                        apex.debug.error(`${CSS_PREFIX} thrownError: ${thrownError}`);
                    }

                    apex.message.showErrors([{
                        type: 'error',
                        location: 'page',
                        message: xhr.responseText,
                        unsafe: false
                    }]);
                }
            });
    }

    if (config.errorMessage) {
        // First clear the errors
        apex.message.clearErrors();

        // Now show new errors
        apex.message.showErrors([   
            {
                type:       "error",
                location:   "page",
                message:    config.errorMessage,
                unsafe:     false
            }
        ]);
    } else {
        // init       
        $(queryBuilderElement).queryBuilder(
            {
                plugins: [
                    'sortable',
                    'sql-support',
                    'not-group',
					'filter-description'
                ],
                filters: config.filters,
                lang_code: apex.locale.getLanguage()
            }
        );
    }

    if (config.expression && typeof config.expression == 'string') {
        setRulesFromSQL(config.expression);
    }

    // plugin's public interface
    apex.region.create(regionId, {
        getSQL() {
            return getSQL();
        },
        setRulesFromSQL(sql) {
            setRulesFromSQL(sql);
        },
        submit() {
            if (!config.errorMessage) {
                submit();
            }
        }
    });
}