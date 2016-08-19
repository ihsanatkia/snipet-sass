(function($, document, window){
    "use strict";

$(document).ready(function(){


    /* Contact Form
        ==================================================================================== */
        (function(e) {
            function n(e, n) {
                this.$form = e;
                this.indexes = {};
                this.options = t;
                for (var r in n) {
                    if (this.$form.find("#" + r).length && typeof n[r] == "function") {
                        this.indexes[r] = n[r]
                    } else {
                        this.options[r] = n[r]
                    }
                }
                this.init()
            }
            var t = {
                _error_class: "error",
                _onValidateFail: function() {}
            };
            n.prototype = {
                init: function() {
                    var e = this;
                    e.$form.on("submit", function(t) {
                        e.process();
                        if (e.hasErrors()) {
                            e.options._onValidateFail();
                            t.stopImmediatePropagation();
                            return false
                        }
                        return true
                    })
                },
                notEmpty: function(e) {
                    return e != "" ? true : false
                },
                isEmail: function(e) {
                    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e)
                },
                isUrl: function(e) {
                    var t = new RegExp("(^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|(www\\.)?))[\\w-]+(\\.[\\w-]+)+([\\w-.,@?^=%&:/~+#-]*[\\w@?^=%&;/~+#-])?", "gim");
                    return t.test(e)
                },
                elClass: "",
                setClass: function(e) {
                    this.elClass = e
                },
                process: function() {
                    this._errors = {};
                    for (var t in this.indexes) {
                        this.$el = this.$form.find("#" + t);
                        if (this.$el.length) {
                            var n = e.proxy(this.indexes[t], this, e.trim(this.$el.val()))();
                            if (this.elClass) {
                                this.elClass.toggleClass(this.options._error_class, !n);
                                this.elClass = ""
                            } else {
                                this.$el.toggleClass(this.options._error_class, !n)
                            }
                            if (!n) {
                                this._errors[t] = n
                            }
                        }
                        this.$el = null
                    }
                },
                _errors: {},
                hasErrors: function() {
                    return !e.isEmptyObject(this._errors)
                }
            };
            e.fn.isValid = function(t) {
                return this.each(function() {
                    var r = e(this);
                    if (!e.data(r, "is_valid")) {
                        e.data(r, "is_valid", new n(r, t))
                    }
                })
            }
        })(jQuery)

        var $form = $('.actionform');

        // get security question
        function setFormAutoValue(cb) {
            $.ajax({
                'url': 'action.php',
                'data': {
                    get_auto_value: ''
                },
                'type': "POST",
                'dataType': 'json',
            }).done(function(response) {

                if (typeof response.data != 'undefined') {
                    $form.find('.auto-safe label').text(unescape(response.data));
                }

                if (cb) {
                    cb();
                }

            });
        }

        $form.on('click', '.auto-refresh', function(e) {
            e.preventDefault();
            var $this = $(this);
            $this.addClass('fa-spin');

            setFormAutoValue(function() {
                $this.removeClass('fa-spin');
            });
        });

        setFormAutoValue();

        //ajax contact form
        $form.isValid({
            'name': function(data) {
                this.setClass(this.$el.parent());
                return this.notEmpty(data);
            },
            'email': function(data) {
                this.setClass(this.$el.parent());
                return this.isEmail(data);
            },
            'subject': function(data) {
                this.setClass(this.$el.parent());
                return this.notEmpty(data);
            },
            'autovalue': function(data) {
                this.setClass(this.$el.parent());
                return this.notEmpty(data);
            }
        }).submit(function(e) {
            e.preventDefault();
            var $this = $(this);

            $this.find('.notification')
                .attr('class', 'notification');
            $this.find('.notification').text('');

            // $this.find('.loading').show();

            $.ajax({
                'url': $this.attr('action'),
                'type': $this.attr('method'),
                'dataType': 'json',
                'data': $(this).serialize()
            }).done(function(response) {
                $this.find('.loading').hide();
                if (typeof response.type != 'undefined' && typeof response.message != 'undefined') {
                    $this.find('.notification')
                        .addClass(response.type + 'msg')
                        .text(response.message);

                    if (response.type == 'success') {
                        $this.find('input[type="text"], input[type="email"], textarea').val('');
                        setFormAutoValue();
                    }
                }
            });

        });

    // END FUNCTION
  }); 





})(jQuery, document, window);


