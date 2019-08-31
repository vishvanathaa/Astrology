$(function() {
    $("#jsGrid").jsGrid({
        height: "50%",
        width: "73%",
        filtering: false,
        inserting: false,
        editing: false,
        sorting: true,
        paging: true,
        autoload: true,
        pageSize: 5,
        pageButtonCount: 5,
        deleteConfirm: "Do you really want to delete horoscope?",
        controller: {
            loadData: function(filter) {
                return $.ajax({
                    type: "GET",
                    url: "/horoscopeList",
                    data: filter
                });
            },
            insertItem: function(item) {
                return $.ajax({
                    type: "POST",
                    url: "/horoscopeList",
                    data: item
                });
            },
            updateItem: function(item) {
                return $.ajax({
                    type: "PUT",
                    url: "/horoscopeList",
                    data: item
                });
            },
            deleteItem: function(item) {
                return $.ajax({
                    type: "DELETE",
                    url: "/horoscopeList",
                    data: item
                });
            }
        },
        fields: [
            { name: "_id", type: "text", visible: false, align:'center', width: 100, filtering: false },
            { name: "icon", type: "text", title: "Symbol", css : "va-icon-font-size", align:'center', width: 50, filtering: false },
            { name: "sign", type: "text", title: "Sign", width: 150, align:'center'},
            { name: "star", type: "text", title: "Star", width: 150,align:'center' },
            { name: "planet", type: "text", title: "Planet (r.k.kj.b.m.g.s.sn)", width: 200,align:'center' },
            { type: "control", width: 50, editButton: false, deleteButton: true, headerButton:false,
            itemTemplate: function(value, item) {
                var $result = jsGrid.fields.control.prototype.itemTemplate.apply(this, arguments);
                var $customEditButton = $("<button>").attr({class: "customGridEditbutton jsgrid-button jsgrid-edit-button"})
                 .click(function(e) {
                   //alert("ID: " + item._id);
                   window.location.href = '/horoscope'
                   e.stopPropagation();
                 });
                var $customDeleteButton = $("<button>").attr({class: "customGridDeletebutton jsgrid-button jsgrid-delete-button"})
                .click(function(e) {
                 e.stopPropagation();
                 if(confirm("Do you really want to delete this record?")){
                     $.ajax({
                        type: "DELETE",
                        url: "/horoscopeList",
                        data: item
                    });
                    window.location.href = '/horoscopeCollection';
                }
               });
             return $("<div>").append($customEditButton).append($customDeleteButton);
           },
         }
            
        ]
    });

    
});


