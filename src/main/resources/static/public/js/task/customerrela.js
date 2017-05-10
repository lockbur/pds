$(function () {
    $("#jqGrid").jqGrid({
        url: '../customerrela/list',
        datatype: "json",
        colModel: [			
			//{ label: 'id', name: 'id', index: 'ID', width: 50, key: true },
			{ label: '客户号码', name: 'custTelnum', index: 'cust_telnum', width: 80 }, 			
			{ label: '客户姓名', name: 'custName', index: 'cust_name', width: 80 }, 			
			{ label: '地市', name: 'city', index: 'city', width: 80 }, 			
			{ label: '客户经理工号', name: 'accountManagerNo', index: 'account_manager_no', width: 80 }, 			
			{ label: '客户经理名称', name: 'accountManagerName', index: 'account_manager_name', width: 80 }
        ],
		viewrecords: true,
        height: 385,
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: true, 
        rownumWidth: 25, 
        autowidth:true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader : {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames : {
            page:"page", 
            rows:"limit", 
            order: "order"
        },
        gridComplete:function(){
        	//隐藏grid底部滚动条
        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
        }
    });
	new AjaxUpload('#upload', {
		action: '../customerrela/upload',
		name: 'file',
		autoSubmit:true,
		responseType:"json",
		onSubmit:function(file, extension){
			if (!(extension && /^(xls|xlsx|csv)$/.test(extension.toLowerCase()))){
				alert('只支持excel和csv格式的图片！');
				return false;
			}
		},
		onComplete : function(file, r){
			if(r.code == 0){
				alert(r.url);
				vm.reload();
			}else{
				alert(r.msg);
			}
		}
	});
});

var vm = new Vue({
	el:'#rrapp',
	data:{
		q:{
			keywords: null
		},
		showList: true,
		title: null,
		customerRela: {}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.customerRela = {};
		},
		update: function (event) {
			var id = getSelectedRow();
			if(id == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(id)
		},
		saveOrUpdate: function (event) {
			var url = vm.customerRela.id == null ? "../customerrela/save" : "../customerrela/update";
			$.ajax({
				type: "POST",
			    url: url,
			    data: JSON.stringify(vm.customerRela),
			    success: function(r){
			    	if(r.code === 0){
						alert('操作成功', function(index){
							vm.reload();
						});
					}else{
						alert(r.msg);
					}
				}
			});
		},
		del: function (event) {
			var ids = getSelectedRows();
			if(ids == null){
				return ;
			}
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: "../customerrela/delete",
				    data: JSON.stringify(ids),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								$("#jqGrid").trigger("reloadGrid");
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		getInfo: function(id){
			$.get("../customerrela/info/"+id, function(r){
                vm.customerRela = r.customerRela;
            });
		},
		reload: function (event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{
				postData:{'keywords': vm.q.keywords},
				page:page
            }).trigger("reloadGrid");
		}
	}
});