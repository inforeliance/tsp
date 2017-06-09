'use strict';


angular.module('tspApp', ['ui.tinymce']).controller('mainCtrl', function(theEvent, $window){
    var vm = this;
    vm.Questions = [];
    vm.tnrEvent = theEvent;
    vm.addQuestion = function(){
        vm.Questions.push({Text:'', Sequence: vm.Questions.length})
    };

    vm.deleteQuestion = function(question){
        if ($window.confirm('Delete question?')) {
            vm.Questions.splice(vm.Questions.indexOf(question), 1);
        }
    };

    vm.tinymceOptions = {
        menubar: false,
        plugins: 'table,save,hr,link,preview,searchreplace,print,contextmenu,paste,fullscreen,nonbreaking,template,lists,advlist',
        toolbar1: 'bold italic underline | formatselect fontselect fontsizeselect',
        toolbar2: "cut copy paste | bullist numlist | outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,cleanup,code,|,insertdate,inserttime,preview,|,forecolor,backcolor,table,|,hr,removeformat,|,fullscreen",
        theme:'modern'
    };
});
