var Work = {
	
	items : [ // lastest is first
		{
			id : 'bbw',
			image : 'work_thumb_bbw_2.jpg',
			imgName : 'work_thumb_bbw_2',
			imgExt : 'jpg',
			title : 'Big Barn World App',
			desc : '',
			link : 'work/bbw'
		},
		{
			id : 'webstandalone',
			image : 'sprite_4x3.png',
			imgName : 'sprite_4x3',
			imgExt : 'png',
			title : 'Game Web Pages ',
			desc : '',
			link : 'work/webstandalone'
		},
		{
			id : 'emails',
			image : 'sprite_4x3.png',
			imgName : 'sprite_4x3',
			imgExt : 'png',
			title : 'Email Templates',
			desc : '',
			link : 'work/emails'
		},
		{
			id : 'airgames',
			image : 'work_thumb_airgames.jpg',
			imgName : 'work_thumb_airgames',
			imgExt : 'jpg',
			title : 'Airgames',
			desc : '',
			link : 'work/airgames'
		},
		{
			id : 'harvest',
			image : 'work_thumb_harvest_2.jpg',
			imgName : 'work_thumb_harvest_2',
			imgExt : 'jpg',
			title : 'Harvest Frenzy',
			desc : '',
			link : 'work/harvest'
		},
		{
			id : 'llab',
			image : 'work_thumb_llab.jpg',
			imgName : 'work_thumb_llab',
			imgExt : 'jpg',
			title : 'Letter Lab',
			desc : '',
			link : 'work/llab'
		}
	],

	nextItem : function(x) {
		if (typeof x === "undefined") {
			return false;
		}
		else if ((typeof x === "number" && x <= 0) || (typeof x === "number" && x > this.items.length - 1)) {
			return this.items[this.items.length - 1];
		}
		else if (typeof x === "number") {
			return this.items[x - 1];
		}
		else return false;
	},

	prevItem : function(x) {
		if (typeof x === "undefined") {
			return false;
		}
		else if ((typeof x === "number" && x < 0) || (typeof x === "number" && x >= this.items.length - 1)) {
			return this.items[0];
		}
		else if (typeof x === "number") {
			return this.items[x + 1];
		}
		else return false;
	},

	insertItems : function(targetId) {

		if (typeof targetId === 'string' && targetId.length > 0) {

			var item = {},
				target = $('#' + targetId);
				
			for (var i = 0; i < this.items.length; i++) {

				item = this.items[i];

				target.append(
					'<li>' +
						'<a href="' + getRoot() + item.link + '">' +
							'<img src="' + getRoot() + 'images/' + item.image + '">' +
						'</a>' +
					'</li>'
				);
			}
		}
		else console.warn('targetId should be a string.');
	},

	insertQuickNav : function(targetId, activeItemId) {

		if (isStringValid(targetId) && isStringValid(activeItemId)) {

			var target = $('#' + targetId);

			console.log("inserting quick nav");
		}
	},

	insertItemsNav : function(activeItem) {
		
		var target = $("#work_items_nav");

		target.append(
			"<ul>" +
				"<li><a href='" + getRoot() + "work.html'>Back to Work</a></li>" +
				"<li><a href='" + getRoot() + this.prevItem(activeItem).link + "'>Prev</a> / <a href='" + getRoot() + this.nextItem(activeItem).link + "'>Next</a></li>" +
			"</ul>"
		);
	}
}