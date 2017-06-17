'use strict';
angular.module('tspApp', ['ui.tinymce', 'ui.sortable', 'ui.bootstrap'])
    .controller('mainCtrl', function (theEvent, $window, $scope) {
        var vm = this;
        vm.uploadProgress = 0;
        vm.Questions = [];
        vm.Sections = [{Sequence: 1}];
        vm.tnrEvent = theEvent;
        vm.tnrEvent.PerformanceSteps.forEach(function (x) {
            x.Sections = x.Sections || [{ID: 2, Sequence: 2}, {ID: 1, Sequence: 1}];
        });

        vm.addQuestion = function () {
            vm.Questions.push({Text: '', Sequence: vm.Questions.length + 1})
        };

        vm.deleteQuestion = function (question) {
            if (question.Text === '' || $window.confirm('Delete question?')) {
                vm.Questions.splice(vm.Questions.indexOf(question), 1);
                for (var i = 0; i < vm.Questions.length; i++) {
                    vm.Questions[i].Sequence = i + 1;
                }
            }
        };

        vm.addSection = function () {
            vm.Sections.push({Sequence: vm.Sections.length + 1});
        };

        vm.deleteSection = function (section) {
            vm.Sections.splice(vm.Sections.indexOf(section), 1);
        };



        vm.save = function(){
            var formData = new FormData();
            formData.append('vm',angular.toJson(vm));
            $.each($("input:file"), function(index, item){
                for (var i=0; i< item.files.length; i++){
                    formData.append('file' + i,item.files[i]);
                }
            });

            function progressFunction(evt) {
                if (evt.lengthComputable) {
                    vm.uploadProgress =Math.round(evt.loaded / evt.total * 100);
                    $scope.$apply();
                }
            }

            $.ajax({
                url: "http://localhost:54470/Home/Upload",
                type: 'POST',
                xhr: function () {
                    var myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) {
                        myXhr.upload.addEventListener('progress', progressFunction, false); // For handling the progress of the upload
                    }
                    return myXhr;
                },
                success: function () { alert('done'); },
                error: function () { alert("There was an error uploading"); },
                data: formData,
                cache: false,
                contentType: false,
                processData: false
            });
        };
    })
    .constant('_', window._)
    .run(function ($rootScope, $window) {
        $rootScope._ = $window._;
        $rootScope.tinymceOptions = {
            inline: true,
            menubar: false,
            plugins: 'table,save,hr,link,preview,searchreplace,print,contextmenu,paste,fullscreen,nonbreaking,template,lists,advlist',
            toolbar1: 'bold italic underline | formatselect fontselect fontsizeselect',
            toolbar2: "cut copy paste | bullist numlist | outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,cleanup,code,|,insertdate,inserttime,preview,|,forecolor,backcolor,table,|,hr,removeformat,|,fullscreen"
        };
    })
    .directive('performanceStepSection', function () {
        return {
            restrict: 'E',
            templateUrl: 'performance-step-section.html',
            scope: {
                performanceStep: '=performanceStep'
            },
            controller: function ($window) {
                var vm = this;

                function sectionIndex(section) {
                    return vm.performanceStep.Sections.indexOf(section);
                }

                vm.AddSection = function () {
                    vm.performanceStep.Sections.push({Sequence: vm.performanceStep.Sections.length + 1});
                };

                vm.DeleteSection = function (section) {
                    if (section.SectionText === '' || $window.confirm('Delete section?')) {
                        vm.performanceStep.Sections.splice(sectionIndex(section), 1);
                        for (var i = 0; i < vm.performanceStep.Sections.length; i++) {
                            vm.performanceStep.Sections[i].Sequence = i + 1;
                        }
                    }
                };
            },
            controllerAs: 'vm',
            bindToController: true
        };
    })
    .directive('nonPerformanceStepSection', function () {
        return {
            restrict: 'E',
            templateUrl: 'non-perf-step-section.html',
            scope: {
                section: '=section'
            },
            controller: function () {
                var vm = this;
            },
            controllerAs: 'vm',
            bindToController: true
        };
    })
    .directive('comment', function () {
        return {
            restrict: 'E',
            templateUrl: 'comment.html',
            scope: {
                comment: '=comment'
            },
            controller: function () {
                var vm = this;
                vm.editClick = function () {
                    vm.originalComment = vm.comment;
                    vm.editing = true;
                };

                vm.cancelClick = function () {
                    vm.comment = vm.originalComment;
                    vm.editing = false;
                };

                vm.okClick = function () {
                    vm.editing = false;
                    vm.isOpen = false;
                };
            },
            controllerAs: 'vm',
            bindToController: true
        };
    });