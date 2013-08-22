/*
evaluatePassword v1.0.0
Author: taknakamu
Git: https://github.com/taknakamu/evaluate-password

Copyright (c) 2013 Kosuke Nakamuta
Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
*/
(function ($) {
    $.fn.extend({
        evaluatePassword: function() {

            var defaults = {
                minimum_length: 8,
                runOnInit: true,
                autoCreateForm: true,
                dictionaryCheck: true,
                dictionaryJsonPath: "../dicrionay.json",
                requireStringKind: 1
            }

            var levels = {
                "0": "短すぎます",
                "1": "低",
                "2": "中",
                "3": "良好",
                "4": "高"
            }

            var patterns = [
                "[a-z]",
                "[A-Z]",
                "[0-9]",
                "-_"
            ];

            var dicattack = null;

            if (defaults.dictionaryCheck) {
                $.getJSON(defaults.dictionaryJsonPath, function(data) {
                    dicattack = data;
                });
            }

            var target_form = $("[data-target=" + $(this).attr("id") + "]");

            if (defaults.autoCreateForm) {
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

                if (val_length < defaults.minimum_length) {
                    level = 0;
                } else {
                    if (defaults.minimum_length <= val_length && val_length <= 10) {
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

                    $.each(patterns, function(i, v) {
                        if (val.match(new RegExp(v))) {
                            countStringKind++;
                        }
                    });

                    if (countStringKind < defaults.requireStringKind) {
                        level = 1;
                    }

                    if (dicattack) {
                        $.each(dicattack, function(i, v) {
                            if (val.match(new RegExp(v)) && v.length < 17) {
                                if ("" === val.replace(new RegExp(v, "g"), "")) {
                                    level = 1;
                                }
                            }
                        });
                    }
                }
                $status.text(levels[level]);
                $level.addClass("password-level" + level);

                return level;
            }

            if (defaults.runOnInit) {
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
