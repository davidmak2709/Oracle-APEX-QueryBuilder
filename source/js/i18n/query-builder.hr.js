/*!
 * jQuery QueryBuilder 2.5.0
 * Locale: Croatian/Hrvatski (hr)
 * Author: David Makovac
 * Licensed under MIT (https://opensource.org/licenses/MIT)
 */

(function(root, factory) {
    if (typeof define == 'function' && define.amd) {
        define(['jquery', 'query-builder'], factory);
    }
    else {
        factory(root.jQuery);
    }
}(this, function($) {
"use strict";

var QueryBuilder = $.fn.queryBuilder;

QueryBuilder.regional['hr'] = {
  "__locale": "Croatian/Hrvatski (hr)",
  "__author": "David Makovac",
  "add_rule": "Dodaj pravilo",
  "add_group": "Dodaj grupu",
  "delete_rule": "Obriši",
  "delete_group": "Obriši",
  "conditions": {
    "AND": "I",
    "OR": "ILI"
  },
  "operators": {
    "equal": "jednako",
    "not_equal": "nije jednako",
    "in": "u",
    "not_in": "ne u",
    "less": "manje",
    "less_or_equal": "manje ili jednako",
    "greater": "veće",
    "greater_or_equal": "veće ili jednako",
    "between": "između",
    "not_between": "nije između",
    "begins_with": "počinje sa",
    "not_begins_with": "ne počinje sa",
    "contains": "sadrži",
    "not_contains": "ne sadrži",
    "ends_with": "završava sa",
    "not_ends_with": "ne završava sa",
    "is_empty": "je prazno",
    "is_not_empty": "nije prazno",
    "is_null": "je null",
    "is_not_null": "nije null"
  },
  "errors": {
    "no_filter": "Nema odabranog filtera",
    "empty_group": "Grupa je prazna",
    "radio_empty": "Nema odabrane vrijednosti",
    "checkbox_empty": "Nema odabrane vrijednosti",
    "select_empty": "Nema odabrane vrijednosti",
    "string_empty": "Prazna vrijednost",
    "string_exceed_min_length": "Mora sadržavati najmanje {0} znakova",
    "string_exceed_max_length": "Ne smije sadržavati više od {0} znakova",
    "string_invalid_format": "Nevažeći format ({0})",
    "number_nan": "Nije broj",
    "number_not_integer": "Nije cijeli broj",
    "number_not_double": "Nije decimalni broj",
    "number_exceed_min": "Mora biti veće od {0}",
    "number_exceed_max": "Mora biti manje od {0}",
    "number_wrong_step": "Mora biti višekratnik {0}",
    "number_between_invalid": "Nevažeće vrijednosti, {0} je veće od {1}",
    "datetime_empty": "Prazna vrijednost",
    "datetime_invalid": "Nevažeći format datuma ({0})",
    "datetime_exceed_min": "Mora biti nakon {0",
    "datetime_exceed_max": "Mora biti prije {0}",
    "datetime_between_invalid": "Nevažeće vrijednosti, {0} je veće od {1}",
    "boolean_not_valid": "Nije Boolean",
    "operator_not_multiple": "Operator \"{1}\" ne može prihvatiti više vrijednosti"
  },
  "Invert": "Obrni",
  "NOT": "NE",
  "value": "Vrijednost",
  "filter": "Filter",
  "operator": "Operator",
  "invert": "Obrnuto"
};

QueryBuilder.defaults({ lang_code: 'hr' });
}));