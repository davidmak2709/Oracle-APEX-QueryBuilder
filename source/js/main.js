/* globals apex,$ */
window.LL = window.LL || {};
LL.region = LL.region || {};
LL.region.queryBuilder = LL.region.queryBuilder || {};


LL.region.queryBuilder.initBuilder = function (config, initJs) {
    apex.debug.info('LL - Query Builder: ', config);

    const lang_code = apex.locale.getLanguage();

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

    function getResult() {
        return $(queryBuilderElement).queryBuilder('getSQL', config.exportFormat);
    }

    function submit() {
        if (config.errorMessage) {
            return;
        }
        const result = getResult();
        if (!result) {
            apex.event.gCancelFlag = true;
            return;
        }
        apex.server.plugin(
            config.pluginAjaxId,
            {
                x01: result.sql,
                x02: JSON.stringify(result.params)
            },
            {
                dataType: 'json',
                success: function (jsonData) {
                    apex.debug.info(`${CSS_PREFIX} jsonData: ${JSON.stringify(jsonData)}`);

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
                    apex.debug.error(`${CSS_PREFIX} ajaxOptions: ${ajaxOptions}`);
                    apex.debug.error(`${CSS_PREFIX} thrownError: ${thrownError}`);

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
        apex.message.clearErrors();
        apex.message.showErrors([
            {
                type: "error",
                location: "page",
                message: config.errorMessage,
                unsafe: false
            }
        ]);
    } else {
        // init       
        $(queryBuilderElement).queryBuilder(
            {
                plugins: config.plugins,
                filters: config.filters,
                lang_code: lang_code
            }
        );
    }

    if (config.expression && typeof config.expression == 'string') {
        setRulesFromSQL(config.expression);
    }

    apex.jQuery(apex.gPageContext$)
        .on("apexbeforepagesubmit", function () {
            apex.region(regionId).submit();
        });

    // plugin's public interface
    apex.region.create(regionId, {
        getResult() {
            return getResult();
        },
        setRulesFromSQL(sql) {
            setRulesFromSQL(sql);
        },
        submit() {
            submit();
        }
    });
}