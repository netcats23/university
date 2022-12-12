BX.ready(function () {

    // Установить обработчик добавления нового комментария

    BX.addCustomEvent(window, 'OnEditorInitedAfter', function () {

        console.log('OnEditorInitedAfter');



        // Получить кнопку "ссылка" внутри редактора

        // let linkBut = BX("bx-b-link-COMMENTS_hMvsxz");

        let linkBut = $('.bxhtmled-button-image')[0];



        $('.fancy-iframe').on('click', '.bxhtmled-button-link', function () {

            // Если обьект диалогового окна существует

            // if (!window.BXHtmlEditor.editors.idLHE_FChMvsxz) {

            //     return;

            // }



            let popups = $('.bx-core-window.bx-core-adm-dialog');

            // Добавить класс окну

            popups.addClass('wrap-add-link-dialog');

            // popup head

            popups.find('div.bx-core-adm-dialog-head').addClass('wrap-add-link-dialog');

            // popup content

            popups.find('div.bx-core-adm-dialog-content').addClass('content-add-link-dialog');







            // if (window.BXHtmlEditor.editors.idLHE_FChMvsxz.components.editor.dialogs.Link.oDialog) {

            if (false) {

                let oDialog = window.BXHtmlEditor.editors.idLHE_FChMvsxz.components.editor.dialogs.Link.oDialog;

                let oDialogDiv = oDialog.DIV; // Окно



                BX.addClass(oDialogDiv, 'wrap-add-link-dialog'); // Добавить класс окну

                // Получить верхную часть окна (где заголовок) и установить ей класс

                let oDialogHead = BX.findChild(oDialogDiv, {

                        "tag": "div",

                        "class": "bx-core-adm-dialog-head"

                    },

                    true, false

                );

                BX.addClass(oDialogHead, 'wrap-add-link-dialog');



                // Получить контент (сами поля)

                let oDialogContent = BX.findChild(oDialogDiv, {

                        "tag": "div",

                        "class": "bx-core-adm-dialog-content"

                    },

                    true, false

                );

                BX.addClass(oDialogContent, 'content-add-link-dialog');



                // Для каждой кнопки установить стиль

                // oDialog.PARAMS.buttons.forEach(function (el) {

                //     BX.addClass(el.btn, 'button-add-link-dialog');

                //     el.btn.style.setProperty('background', 'var(--red-dark)', 'important');

                //     BX.style(el.btn, 'border-color', 'var(--red-dark)');

                //     BX.style(el.btn, 'color', '#FFFFFF');

                // })



                // let oDialogButtons = BX.findChild(oDialogDiv, {

                //         "tag" : "div",

                //         "class" : "bx-core-adm-dialog-buttons"

                //     },

                //     true,false

                // );

                // BX.addClass(oDialogButtons, 'wrap-add-link-dialog');

            }

        })



        let videoBut = BX("bx-b-video-COMMENTS_hMvsxz");

        if (videoBut) {

            videoBut.addEventListener('click', color_bx_popup());

        }

        let linkButton = BX("bx-b-link-COMMENTS_hMvsxz");

        if (linkButton) {



            linkButton.addEventListener('click', color_bx_popup());

        }

        function color_bx_popup(){

            console.log("call");

            // Если обьект диалогового окна существует

            if (!window.BXHtmlEditor.editors.idLHE_FChMvsxz) {

                return;

            }

            console.log(window.BXHtmlEditor.editors.idLHE_FChMvsxz.components.editor);

            /* if (window.BXHtmlEditor.editors.idLHE_FChMvsxz.components.editor.dialogs.Link.oDialog) {

                 let oDialog = window.BXHtmlEditor.editors.idLHE_FChMvsxz.components.editor.dialogs.Link.oDialog;

                 let oDialogDiv = oDialog.DIV; // Окно



                 BX.addClass(oDialogDiv, 'wrap-add-link-dialog'); // Добавить класс окну

                 // Получить верхную часть окна (где заголовок) и установить ей класс

                 let oDialogHead = BX.findChild(oDialogDiv, {

                         "tag": "div",

                         "class": "bx-core-adm-dialog-head"

                     },

                     true, false

                 );

                 BX.addClass(oDialogHead, 'wrap-add-link-dialog');



                 // Получить контент (сами поля)

                 let oDialogContent = BX.findChild(oDialogDiv, {

                         "tag": "div",

                         "class": "bx-core-adm-dialog-content"

                     },

                     true, false

                 );

                 BX.addClass(oDialogContent, 'content-add-link-dialog');



             }*/

        }

      /*let videoBut = BX("bx-b-video-COMMENTS_hMvsxz");

        if (videoBut) {

            // Установить обработчик на клике по кнопке "ссылка"

            videoBut.addEventListener('click', function () {

                // Если обьект диалогового окна существует

                if (!window.BXHtmlEditor.editors.idLHE_FChMvsxz) {

                    return;

                }

                if (window.BXHtmlEditor.editors.idLHE_FChMvsxz.components.editor.dialogs.Video.oDialog) {

                    let oDialog = window.BXHtmlEditor.editors.idLHE_FChMvsxz.components.editor.dialogs.Video.oDialog;

                    let oDialogDiv = oDialog.DIV; // Окно



                    BX.addClass(oDialogDiv, 'wrap-add-link-dialog'); // Добавить класс окну

                    // Получить верхную часть окна (где заголовок) и установить ей класс

                    let oDialogHead = BX.findChild(oDialogDiv, {

                            "tag": "div",

                            "class": "bx-core-adm-dialog-head"

                        },

                        true, false

                    );

                    BX.addClass(oDialogHead, 'wrap-add-link-dialog');



                    // Получить контент (сами поля)

                    let oDialogContent = BX.findChild(oDialogDiv, {

                            "tag": "div",

                            "class": "bx-core-adm-dialog-content"

                        },

                        true, false

                    );

                    BX.addClass(oDialogContent, 'content-add-link-dialog');



                    // Для каждой кнопки установить стиль

                    // oDialog.PARAMS.buttons.forEach(function (el) {

                    //     BX.addClass(el.btn, 'button-add-link-dialog');

                    //     el.btn.style.setProperty('background', 'var(--red-dark)', 'important');

                    //     BX.style(el.btn, 'border-color', 'var(--red-dark)');

                    //     BX.style(el.btn, 'color', '#FFFFFF');

                    // })



                    // let oDialogButtons = BX.findChild(oDialogDiv, {

                    //         "tag" : "div",

                    //         "class" : "bx-core-adm-dialog-buttons"

                    //     },

                    //     true,false

                    // );

                    // BX.addClass(oDialogButtons, 'wrap-add-link-dialog');

                }

            });

        }*/

    });

});
