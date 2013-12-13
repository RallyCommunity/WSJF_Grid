Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {
        //Write app code here
        this._loadFeatures();
    },
    
    _loadFeatures: function() { 
    	var that = this;
    	 console.log("Loading Features");
    	 Ext.create('Rally.data.WsapiDataStore',{
    	 	model: 'PortfolioItem/Feature',
    	 	autoLoad: true,
    	 	remoteSort: false,
    	 	listeners:{
    	 		load: function(store,records,success){
    	 			if(records!=null){
    	 			console.log("Loaded store with %i records",records.length);
    	 			Ext.Array.each(records,function(feature){
    	 				
    	 				feature.set("Score",that._checkValue((feature.get("c_TimeValue")+feature.get("c_UserValue"))/feature.get("c_JobSize")));
    	 			});
    	 			
    	 			this._updateGrid(store);
    	 			}
    	 	},
    	 		
    	 		scope: this
    	 	},
    	 	fetch: ['Name','FormattedID','c_JobSize','c_TimeValue','c_UserValue']
    	 });
    },
    _checkValue: function(value){
    	if(isNaN(value))
    		return -1;
    	else 
    	 return Math.round(value*10)/10;
    },
    _createGrid: function(myStore){
    	console.log("Load up a populated grid! ");
    	this._myGrid = Ext.create('Rally.ui.grid.Grid',{
    		xtype: 'rallygrid',
    		title: 'Feature Scoping Grid',
    		height: 500,
    		store: myStore,
    		enabelEditing: true,
    		remoteSort: false,
    		selType: 'cellmodel',
    		columnCfgs:[{
    			text: 'Portfolio ID',
    			dataIndex: 'FormattedID',
    			flex: 1,
    			xtype: 'templatecolumn',
    			tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate'),
    			sortable: true
    		},{
    			text: 'Name',
    			dataIndex: 'Name',
    			flex: 2,
    			sortable: true
    		},{
    			text: 'Time Value',
    			
    			dataIndex: 'c_TimeValue',
    			sortable: true
    		},{
    			text: 'Job Size',
    			dataIndex: 'c_JobSize',
    			sortable: true
    		},{
    			text: 'User Value',
    			dataIndex: 'c_UserValue',
    			sortable: true
    		},{
    			text: 'Score',
    			dataIndex: 'Score',
    			remoteSort: false,
    			doSort: function(state){
    				var ds = this.up('grid').getStore();
    				var field = this.getSortParam();
    				ds.sort({
    					property: field,
    					direction: state,
    					
    					sorterFn: function(v1,v2){
    						v1 = v1.get(field);
    						v2 = v2.get(field);
    						return v1 > v2 ? 1 : (v1 < v2? -1 : 0);
    					}
    				});
    				
    			}
    		}]
    	});
    	this.add(this._myGrid);
    },
    
    _updateGrid: function(myStore){
    	if(this._myGrid === undefined)
    		this._createGrid(myStore);
    	else
    		this._myGrid.reconfigure(myStore);
    }
});


