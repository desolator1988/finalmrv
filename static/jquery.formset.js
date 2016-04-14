/**
 * jQuery Formset 1.2
 * @author Stanislaus Madueke (stan DOT madueke AT gmail DOT com)
 * @requires jQuery 1.2.6 or later
 *
 * Copyright (c) 2009, Stanislaus Madueke
 * All rights reserved.
 *
 * Licensed under the New BSD License
 * See: http://www.opensource.org/licenses/bsd-license.php
 */
;(function($) {
    $.fn.formset = function(opts)
    {
        var options = $.extend({}, $.fn.formset.defaults, opts),
            flatExtraClasses = options.extraClasses.join(' '),
            $$ = $(this),

            applyExtraClasses = function(row, ndx) {
                if (options.extraClasses) {
                    row.removeClass(flatExtraClasses);
                    row.addClass(options.extraClasses[ndx % options.extraClasses.length]);
                }
            },

            updateElementIndex = function(elem, prefix, ndx) {
                var idRegex = new RegExp('(' + prefix + '-\\d+-)|(^)'),
                    replacement = prefix + '-' + ndx + '-';
                if (elem.attr("for")) elem.attr("for", elem.attr("for").replace(idRegex, replacement));
                if (elem.attr('id')) elem.attr('id', elem.attr('id').replace(idRegex, replacement));
                if (elem.attr('name')) elem.attr('name', elem.attr('name').replace(idRegex, replacement));
            },

            hasChildElements = function(row) {
                return row.find('input,select,textarea,label').length > 0;
            },

            insertDeleteLink = function(row) {

                if (row.is('TR')) {
                    // If the forms are laid out in table rows, insert
                    // the remove button into the last table cell:
                    row.children(':last').append('<a class="' + options.deleteCssClass +'" href="javascript:void(0)">' + options.customHtmlButtonRemove + options.deleteText + options.customHtmlButtonClose +'</a>');
                } else if (row.is('UL') || row.is('OL')) {
                    // If they're laid out as an ordered/unordered list,
                    // insert an <li> after the last list item:
                    row.append('<li><a class="' + options.deleteCssClass + '" href="javascript:void(0)">' + options.customHtmlButtonRemove + options.deleteText + options.customHtmlButtonClose + '</a></li>');
                } else {
                    // Otherwise, just insert the remove button as the
                    // last child element of the form's container:
                    row.append('<a class="' + options.deleteCssClass + '" href="javascript:void(0)">' + options.customHtmlButtonRemove + options.deleteText + options.customHtmlButtonClose +'</a>');
                }
                row.find('a.' + options.deleteCssClass).click(function() {
                    console.log('delete button clicked');
                    var row = $(this).parents('.' + options.formCssClass),
                        del = row.find('input:hidden[id $= "-DELETE"]');
                    if (del.length) {
                        // We're dealing with an inline formset; rather than remove
                        // this form from the DOM, we'll mark it as deleted and hide
                        // it, then let Django handle the deleting:
                        del.val('on');
                        row.hide();
                    } else {
                        row.remove();
                        // Update the TOTAL_FORMS form count.
                        // Also update names and IDs for all remaining form controls so they remain in sequence:
                        var forms = $('.' + options.formCssClass).not('.formset-custom-template');
                        $('#id_' + options.prefix + '-TOTAL_FORMS').val(forms.length);
                        for (var i=0, formCount=forms.length; i<formCount; i++) {
                            applyExtraClasses(forms.eq(i), i);
                            forms.eq(i).find('input,select,textarea,label').each(function() {
                                updateElementIndex($(this), options.prefix, i);
                            });
                        }
                    }
                    // If a post-delete callback was provided, call it with the deleted form:
                    if (options.removed) options.removed(row);
                    return false;
                });
            };

        $$.each(function(i) {
            var row = $(this),
                del = row.find('input:checkbox[id $= "-DELETE"]');
            if (del.length) {
                // If you specify "can_delete = True" when creating an inline formset,
                // Django adds a checkbox to each form in the formset.
                // Replace the default checkbox with a hidden field:
                del.before('<input type="hidden" name="' + del.attr('name') +'" id="' + del.attr('id') +'" />');
                del.remove();
            }
            if (hasChildElements(row)) {
                insertDeleteLink(row);
                row.addClass(options.formCssClass);
                applyExtraClasses(row, i);
            }
        });

        if ($$.length) {
            var addButton, template;
            if (options.formTemplate) {
                // If a form template was specified, we'll clone it to generate new form instances:
                template = (options.formTemplate instanceof $) ? options.formTemplate : $(options.formTemplate);
                template.removeAttr('id').addClass(options.formCssClass).addClass('formset-custom-template');
                template.find('input,select,textarea,label').each(function() {
                    updateElementIndex($(this), options.prefix, 2012);
                });
                insertDeleteLink(template);
            } else {
                // Otherwise, use the last form in the formset; this works much better if you've got
                // extra (>= 1) forms (thnaks to justhamade for pointing this out):
                template = $('.' + options.formCssClass + ':last').clone(true).removeAttr('id');
                template.find('input:hidden[id $= "-DELETE"]').remove();
                template.find('input,select,textarea,label').each(function() {
                    var elem = $(this);
                    // If this is a checkbox or radiobutton, uncheck it.
                    // This fixes Issue 1, reported by Wilson.Andrew.J:
                    if (elem.is('input:checkbox') || elem.is('input:radio')) {
                        elem.attr('checked', false);
                    } else {
                        elem.val('');
                    }
                });
            }
            // FIXME: Perhaps using $.data would be a better idea?
            options.formTemplate = template;

            if ($$.prop('tagName') == 'TR') {
                console.log("yes TR");
                // If forms are laid out as table rows, insert the
                // "add" button in a new table row:
                var numCols = $$.eq(0).children().length;
                $$.filter(':last').after('<tr><td colSpan="' + (numCols - 1) + '"><a class="' + options.addCssClass + '" id="addbutton" href="javascript:void(0)">' + options.customHtmlButtonAdd + options.addText + options.customHtmlButtonClose + '</a></td></tr>');
                console.log($$.eq(0).children().length)
                addButton = $('#addbutton');
                addButton.parents('tr').addClass(options.formCssClass + '-add');
            } else {
                console.log("No TR");
                // Otherwise, insert it immediately after the last form:
                $$.filter(':last').after('<div><a class="' + options.addCssClass + '" id="addstratum" href="javascript:void(0)">' + options.customHtmlButtonAdd + options.addText + options.customHtmlButtonClose +  '</a></div>');
                addButton = $$.filter(':last').next();
            }
            addButton.click(function() {
                console.log('Add Parcel clicked');
                var formCount = parseInt($('#id_' + options.prefix + '-TOTAL_FORMS').val()),
                    row = options.formTemplate.clone(true).removeClass('formset-custom-template'),
                    buttonRow = $(this).parents('tr.' + options.formCssClass + '-add').get(0) || this;
                applyExtraClasses(row, formCount);
                row.insertBefore($(buttonRow)).show();
                row.find('input,select,textarea,label').each(function() {
                    updateElementIndex($(this), options.prefix, formCount);
                });
                $('#id_' + options.prefix + '-TOTAL_FORMS').val(formCount + 1);
                // If a post-add callback was supplied, call it with the added form:
                if (options.added) options.added(row);
                return false;
            });
        }

        return $$;
    }

    /* Setup plugin defaults */
    $.fn.formset.defaults = {
        prefix: 'form',                  // The form prefix for your django formset
        formTemplate: null,              // The jQuery selection cloned to generate new form instances
        addText: 'add another',          // Text for the add link
        deleteText: 'remove',            // Text for the delete link
        addCssClass: 'add-row',          // CSS class applied to the add link
        deleteCssClass: 'delete-row',    // CSS class applied to the delete link
        formCssClass: 'dynamic-form',    // CSS class applied to each form in a formset
        extraClasses: [],                // Additional CSS classes, which will be applied to each form in turn
        added: null,                     // Function called each time a new form is added
        removed: null,                   // Function called each time a form is deleted
        customHtmlButtonRemove: '',      // The button that we will use for the remove link (added 11/15/2013 3:51PM)
        customHtmlButtonAdd: '',         // The button that we will use for the add link (added 11/15/2013 3:51PM)
        customHtmlButtonClose: ''        // The closing tag that we will use for the links. This is needed so that we don't have to deal with two different cases
                                         //     where one case is using buttons and the other case is just using links. ** There might be a better way to do this
                                         //     Added: 11/15/2013 3:54PM
    };
})(jQuery)
