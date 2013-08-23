/*
evaluatePassword v1.0.1
Author: taknakamu
Git: https://github.com/taknakamu/evaluate-password

Copyright (c) 2013 Kosuke Nakamuta
Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
*/
(function ($) {
    $.fn.extend({
        evaluatePassword: function(options) {

            var defaults = {
                minimum_length     : 8,
                runOnInit          : true,
                autoCreateForm     : false,
                dictionaryCheck    : true,
                dictionaryJsonPath : "../dicrionay.json",
                requireStringKind  : 1,
                levels             : {
                                        "0": "短すぎます",
                                        "1": "低",
                                        "2": "中",
                                        "3": "良好",
                                        "4": "高"
                                     },
                patterns           : [
                                        "[a-z]",
                                        "[A-Z]",
                                        "[0-9]",
                                        "-_"
                                     ]

            }
            options = $.extend(defaults, options);

            if (options.dictionaryCheck) {
                if (!$.evaluate_password) {
                    $.getJSON(options.dictionaryJsonPath, function(data) {
                        $.extend({
                            "evaluate_password": {
                                "dictionaly": data
                            }
                        });
                    });
                }
            }

            var target_form = $("[data-target=" + $(this).attr("id") + "]");

            if (options.autoCreateForm) {
                createPasswordMeter();
            }

            function createPasswordMeter() {

                target_form.append($("<b/>").text("パスワードの安全度："))
                           .append ($("<span/>").addClass("password-status"))
                           .append ($("<div/>").addClass("password-bar")
                                               .append($("<div/>").addClass("password-level"))
                );

            }

            function evaluatePassword() {
                var val = $(this).val();
                var val_length = val.length;
                var element = $(this).attr("id");

                var $status = target_form.find(".password-status");
                var $level =  target_form.find("[class^=password-level]");
                var level = 0;

                $level.removeClass();

                if (val_length < options.minimum_length) {
                    level = 0;
                } else {
                    if (options.minimum_length <= val_length && val_length <= 10) {
                        level = 1;
                    } else if (11 <= val_length) {
                        level = 2;
                    }

                    var valry = {};

                    $(val.split("")).each(function(i,v) {
                        valry[v] = 1;
                    });

                    var point = 0;

                    $.each(valry, function() {
                        point++;
                    });

                    if (point <= 1) {
                        if (val.match(/a|q|z|o|m|[0-9]/) && level === 2 &&
                            12 <= val_length && val_length <= 18) {

                            if (val_length%2 === 1) {
                                level--;
                            }
                        }
                    } else if (point <= 4) {
                        level++;
                    } else if (5 <= point) {
                        level += 2;
                    }

                    var countStringKind = 0;

                    $.each(options.patterns, function(i, v) {
                        if (val.match(new RegExp(v))) {
                            countStringKind++;
                        }
                    });

                    if (countStringKind < options.requireStringKind) {
                        level = 1;
                    }

                    if (options.dictionaryCheck && $.evaluate_password) {
                        $.each($.evaluate_password.dictionaly, function(i, v) {
                            if (val.match(new RegExp(v)) && val.length < 17) {
                                if ("" === val.replace(new RegExp(v, "g"), "")) {
                                    level = 1;
                                }
                            }
                        });
                    }
                }

                $status.text(options.levels[level]);
                $level.addClass("password-level" + level);
                $(this)[0].level = level;
            }

            if (options.runOnInit) {
                this.each(function () {
                    return evaluatePassword.apply(this);
                });
            }

            return this.each(function () {
                $(this).bind('keyup focus', evaluatePassword);
            });
        }
    });
})(jQuery);
