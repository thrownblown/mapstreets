(function(e,i){var m=window.TimelineSetter=(window.TimelineSetter||{});var s=function(E){E.bind=function(I,F){var G=(this._callbacks=this._callbacks||{});var H=(G[I]=G[I]||[]);H.push(F)};E.trigger=function(H){if(!this._callbacks){return}var G=this._callbacks[H];if(!G){return}for(var F=0;F<G.length;F++){G[F].apply(this,arguments)}}};var B=function(E){E.move=function(G,F){if(!F.deltaX){return}if(_.isUndefined(this.currOffset)){this.currOffset=0}this.currOffset+=F.deltaX;this.el.css({left:this.currOffset})};E.zoom=function(G,F){if(!F.width){return}this.el.css({width:F.width})}};var c=function(F,E){F.$=function(G){return window.$(G,E)}};var A="ontouchstart" in document;if(A){e.event.props.push("touches")}var d=function(I){var G;function E(K){K.preventDefault();G={x:K.pageX};K.type="dragstart";I.el.trigger(K)}function F(K){if(!G){return}K.preventDefault();K.type="dragging";K=_.extend(K,{deltaX:(K.pageX||K.touches[0].pageX)-G.x});G={x:(K.pageX||K.touches[0].pageX)};I.el.trigger(K)}function J(K){if(!G){return}G=null;K.type="dragend";I.el.trigger(K)}if(!A){I.el.bind("mousedown",E);e(document).bind("mousemove",F);e(document).bind("mouseup",J)}else{var H;I.el.bind("touchstart",function(M){var K=Date.now();var N=K-(H||K);var L=N>0&&N<=250?"doubletap":"tap";G={x:M.touches[0].pageX};H=K;I.el.trigger(e.Event(L))});I.el.bind("touchmove",F);I.el.bind("touchend",J)}};var o=/WebKit\/533/.test(navigator.userAgent);var y=function(F){function E(H){H.preventDefault();var I=(H.wheelDelta||-H.detail);if(o){var G=I<0?-1:1;I=Math.log(Math.abs(I))*G*2}H.type="scrolled";H.deltaX=I;F.el.trigger(H)}F.el.bind("mousewheel DOMMouseScroll",E)};var w=function(){this.min=+Infinity;this.max=-Infinity};w.prototype.extend=function(E){this.min=Math.min(E,this.min);this.max=Math.max(E,this.max)};w.prototype.width=function(){return this.max-this.min};w.prototype.project=function(F,E){return(F-this.min)/this.width()*E};var h=function(G,E){this.max=G.max;this.min=G.min;if(!E||!this.INTERVALS[E]){var F=this.computeMaxInterval();this.maxInterval=this.INTERVAL_ORDER[F];this.idx=F}else{this.maxInterval=E;this.idx=_.indexOf(this.INTERVAL_ORDER,E)}};h.dateFormats=function(H){var J=new Date(H);var I={};var F=["Jan.","Feb.","March","April","May","June","July","Aug.","Sept.","Oct.","Nov.","Dec."];var G=J.getHours()>12;var E=J.getHours()>=12;I.month=F[J.getMonth()];I.year=J.getFullYear();I.date=I.month+" "+J.getDate()+", "+I.year;I.hourWithMinutes=(G?J.getHours()-12:(J.getHours()>0?J.getHours():"12"))+":"+z(J.getMinutes())+" "+(E?"p.m.":"a.m.");I.hourWithMinutesAndSeconds=I.hourWithMinutes+":"+z(J.getSeconds());return h.formatter(J,I)||I};h.dateStr=function(F,E){var G=new h.dateFormats(F);switch(E){case"Decade":return G.year;case"Lustrum":return G.year;case"FullYear":return G.year;case"Month":return G.month+", "+G.year;case"Week":return G.date;case"Date":return G.date;case"Hours":return G.hourWithMinutes;case"Minutes":return G.hourWithMinutes;case"Seconds":return G.hourWithMinutesAndSeconds}};h.prototype={INTERVALS:{Decade:315360000000,Lustrum:157680000000,FullYear:31536000000,Month:2592000000,Week:604800000,Date:86400000,Hours:3600000,Minutes:60000,Seconds:1000},INTERVAL_ORDER:["Seconds","Minutes","Hours","Date","Week","Month","FullYear","Lustrum","Decade"],isAtLeastA:function(E){return((this.max-this.min)>this.INTERVALS[E])},computeMaxInterval:function(){for(var E=0;E<this.INTERVAL_ORDER.length;E++){if(!this.isAtLeastA(this.INTERVAL_ORDER[E])){break}}return E-1},getMaxInterval:function(){return this.INTERVALS[this.INTERVAL_ORDER[this.idx]]},getDecade:function(E){return(E.getFullYear()/10|0)*10},getLustrum:function(E){return(E.getFullYear()/5|0)*5},getWeekFloor:function(E){thisDate=new Date(E.getFullYear(),E.getMonth(),E.getDate());thisDate.setDate(E.getDate()-E.getDay());return thisDate},getWeekCeil:function(E){thisDate=new Date(E.getFullYear(),E.getMonth(),E.getDate());thisDate.setDate(thisDate.getDate()+(7-E.getDay()));return thisDate},floor:function(G){var F=new Date(G);var H=this.INTERVAL_ORDER[this.idx];var E=this.idx>_.indexOf(this.INTERVAL_ORDER,"FullYear")?_.indexOf(this.INTERVAL_ORDER,"FullYear"):E;switch(H){case"Decade":F.setFullYear(this.getDecade(F));break;case"Lustrum":F.setFullYear(this.getLustrum(F));break;case"Week":F.setDate(this.getWeekFloor(F).getDate());E=_.indexOf(this.INTERVAL_ORDER,"Week")}while(E--){H=this.INTERVAL_ORDER[E];if(H!=="Week"){F["set"+H](H==="Date"?1:0)}}return F.getTime()},ceil:function(F){var E=new Date(this.floor(F));var G=this.INTERVAL_ORDER[this.idx];switch(G){case"Decade":E.setFullYear(this.getDecade(E)+10);break;case"Lustrum":E.setFullYear(this.getLustrum(E)+5);break;case"Week":E.setTime(this.getWeekCeil(E).getTime());break;default:E["set"+G](E["get"+G]()+1)}return E.getTime()},span:function(E){return this.ceil(E)-this.floor(E)},getRanges:function(){if(this.intervals){return this.intervals}this.intervals=[];for(var E=this.floor(this.min);E<=this.ceil(this.max);E+=this.span(E)){this.intervals.push({human:h.dateStr(E,this.maxInterval),timestamp:E})}return this.intervals}};var n=function(E,G){var F=Array.prototype.slice.call(arguments,2);_.each(F,function(H){E.bind(H,function(){G[H].apply(G,arguments)})})};var v=function(E){return parseInt(E.replace(/^[^+\-\d]?([+\-]?\d+)?.*$/,"$1"),10)};var z=function(E){return(E<10?"0":"")+E};var t=/^#*/;var r={get:function(){return window.location.hash.replace(t,"")},set:function(E){window.location.hash=E}};var x=1;var u=function(){var E;if(x<10){E=x;x+=1}else{E="default"}return E};var j=m.Timeline=function(F,E){_.bindAll(this,"render");this.data=F.sort(function(H,G){return H.timestamp-G.timestamp});this.bySid={};this.cards=[];this.series=[];this.config=E;this.config.container=this.config.container||"#timeline";h.formatter=this.config.formatter||function(H,G){return G}};s(j.prototype);j.prototype=_.extend(j.prototype,{render:function(){var F=this;c(this,this.config.container);e(this.config.container).html(JST.timeline());this.bounds=new w();this.bar=new b(this);this.cardCont=new q(this);this.createSeries(this.data);var E=new h(this.bounds,this.config.interval);this.intervals=E.getRanges();this.bounds.extend(this.bounds.min-E.getMaxInterval()/2);this.bounds.extend(this.bounds.max+E.getMaxInterval()/2);this.bar.render();n(this.bar,this.cardCont,"move","zoom");this.trigger("render");new f("in",this);new f("out",this);this.chooseNext=new C("next",this);this.choosePrev=new C("prev",this);if(!this.$(".TS-card_active").is("*")){this.chooseNext.click()}e(this.config.container).bind("click",_.bind(this.setGlobalCurrentTimeline,this));this.trigger("load")},setGlobalCurrentTimeline:function(){m.currentTimeline=this},createSeries:function(F){for(var E=0;E<F.length;E++){this.add(F[E])}},add:function(E){if(!(E.series in this.bySid)){this.bySid[E.series]=new l(E,this);this.series.push(this.bySid[E.series])}var F=this.bySid[E.series];F.add(E);this.bounds.extend(F.max());this.bounds.extend(F.min());this.trigger("cardAdd",E)}});var b=function(F){var E=this;this.timeline=F;this.el=this.timeline.$(".TS-notchbar");this.el.css({left:0});d(this);y(this);_.bindAll(this,"moving","doZoom");this.el.bind("dragging scrolled",this.moving);this.el.bind("doZoom",this.doZoom);this.el.bind("dblclick doubletap",function(G){G.preventDefault();E.timeline.$(".TS-zoom_in").click()})};s(b.prototype);B(b.prototype);b.prototype=_.extend(b.prototype,{moving:function(H){var G=this.el.parent();var F=G.offset().left;var I=this.el.offset().left;var E=this.el.width();if(_.isUndefined(H.deltaX)){H.deltaX=0}if(I+E+H.deltaX<F+G.width()){H.deltaX=(F+G.width())-(I+E)}if(I+H.deltaX>F){H.deltaX=F-I}this.trigger("move",H);this.timeline.trigger("move",H);this.move("move",H)},doZoom:function(J,F){var G=this;var E=this.timeline.$(".TS-notch_active");var I=function(){return E.length>0?E.position().left:0};var H=I();this.el.animate({width:F+"%"},{step:function(M,K){var L=e.Event("dragging");var N=H-I();L.deltaX=N;G.moving(L);H=I();L=e.Event("zoom");L.width=M+"%";G.trigger("zoom",L)}})},render:function(){var G=this.timeline.intervals;var H=this.timeline.bounds;for(var F=0;F<G.length;F++){var E=JST.year_notch({timestamp:G[F].timestamp,human:G[F].human});this.el.append(e(E).css("left",H.project(G[F].timestamp,100)+"%"))}}});var q=function(E){this.el=E.$(".TS-card_scroller_inner")};s(q.prototype);B(q.prototype);var l=function(E,F){this.timeline=F;this.name=E.series;this.color=this.name.length>0?u():"default";this.cards=[];_.bindAll(this,"render","showNotches","hideNotches");this.timeline.bind("render",this.render)};s(l.prototype);l.prototype=_.extend(l.prototype,{add:function(E){var F=new k(E,this);this.cards.push(F)},_comparator:function(E){return E.timestamp},hideNotches:function(E){E.preventDefault();this.el.addClass("TS-series_legend_item_inactive");this.trigger("hideNotch")},showNotches:function(E){E.preventDefault();this.el.removeClass("TS-series_legend_item_inactive");this.trigger("showNotch")},render:function(E){if(this.name.length===0){return}this.el=e(JST.series_legend(this));this.timeline.$(".TS-series_nav_container").append(this.el);this.el.toggle(this.hideNotches,this.showNotches)}});_(["min","max"]).each(function(E){l.prototype[E]=function(){return _[E].call(_,this.cards,this._comparator).get("timestamp")}});var k=function(E,F){this.series=F;this.timeline=this.series.timeline;E=_.clone(E);this.timestamp=E.timestamp;this.attributes=E;this.attributes.topcolor=F.color;_.bindAll(this,"render","activate","flip","setPermalink","toggleNotch");this.series.bind("hideNotch",this.toggleNotch);this.series.bind("showNotch",this.toggleNotch);this.timeline.bind("render",this.render);this.timeline.bar.bind("flip",this.flip);this.id=[this.get("timestamp"),this.get("description").split(/ /)[0].replace(/[^a-zA-Z\-]/g,"")].join("-");this.timeline.cards.push(this)};k.prototype=_.extend(k.prototype,{get:function(E){return this.attributes[E]},render:function(){this.offset=this.timeline.bounds.project(this.timestamp,100);var E=JST.notch(this.attributes);this.notch=e(E).css({left:this.offset+"%"});this.timeline.$(".TS-notchbar").append(this.notch);this.notch.click(this.activate);if(r.get()===this.id){this.activate()}},flip:function(){if(!this.el||!this.el.is(":visible")){return}var E=this.$(".TS-item").offset().left+this.$(".TS-item").width();var I=this.timeline.$(".timeline_setter").offset().left+this.timeline.$(".timeline_setter").width();var H=this.el.css("margin-left")===this.originalMargin;var G=this.$(".TS-item").width()<this.timeline.$(".timeline_setter").width()/2;var F=this.el.position().left-this.$(".TS-item").width()<0;if(I-E<0&&H&&!F){this.el.css({"margin-left":-(this.$(".TS-item").width()+7)});this.$(".TS-css_arrow").css({left:this.$(".TS-item").width()})}else{if(this.el.offset().left-this.timeline.$(".timeline_setter").offset().left<0&&!H&&G){this.el.css({"margin-left":this.originalMargin});this.$(".TS-css_arrow").css({left:0})}}},activate:function(F){var E=this;this.hideActiveCard();if(!this.el){this.el=e(JST.card({card:this}));c(this,this.el);this.el.css({left:this.offset+"%"});this.timeline.$(".TS-card_scroller_inner").append(this.el);this.originalMargin=this.el.css("margin-left");this.el.delegate(".TS-permalink","click",this.setPermalink);this.timeline.$("img").load(this.activate)}this.el.show().addClass(("TS-card_active"));this.notch.addClass("TS-notch_active");this.setWidth();this.flip();this.move();this.series.timeline.trigger("cardActivate",this.attributes)},setWidth:function(){var F=this;var E=_.max(_.toArray(this.$(".TS-item_user_html").children()),function(G){return F.$(G).width()});if(this.$(E).width()>this.$(".TS-item_year").width()){this.$(".TS-item_label").css("width",this.$(E).width())}else{this.$(".TS-item_label").css("width",this.$(".TS-item_year").width())}},move:function(){var F=e.Event("moving");var G=this.$(".TS-item").offset();var E=this.timeline.$(".timeline_setter").offset();if(G.left<E.left){F.deltaX=E.left-G.left+v(this.$(".TS-item").css("padding-left"));this.timeline.bar.moving(F)}else{if(G.left+this.$(".TS-item").outerWidth()>E.left+this.timeline.$(".timeline_setter").width()){F.deltaX=E.left+this.timeline.$(".timeline_setter").width()-(G.left+this.$(".TS-item").outerWidth());this.timeline.bar.moving(F)}}},setPermalink:function(){r.set(this.id)},hideActiveCard:function(){this.timeline.$(".TS-card_active").removeClass("TS-card_active").hide();this.timeline.$(".TS-notch_active").removeClass("TS-notch_active")},toggleNotch:function(E){switch(E){case"hideNotch":this.notch.hide().removeClass("TS-notch_active").addClass("TS-series_inactive");if(this.el){this.el.hide()}return;case"showNotch":this.notch.removeClass("TS-series_inactive").show()}}});var g=function(){};var p=function(F,E){g.prototype=E.prototype;F.prototype=new g();F.prototype.constructor=F};var D=function(G,F){this.timeline=F;this.direction=G;this.el=this.timeline.$(this.prefix+G);var E=this;this.el.bind("click",function(H){H.preventDefault();E.click(H)})};var a=100;var f=function(F,E){D.apply(this,arguments)};p(f,D);f.prototype=_.extend(f.prototype,{prefix:".TS-zoom_",click:function(){a+=(this.direction==="in"?+100:-100);if(a>=100){this.timeline.$(".TS-notchbar").trigger("doZoom",[a])}else{a=100}}});var C=function(F,E){D.apply(this,arguments);this.notches=this.timeline.$(".TS-notch")};p(C,D);C.prototype=_.extend(D.prototype,{prefix:".TS-choose_",click:function(I){var F;var H=this.notches.not(".TS-series_inactive");var E=H.index(this.timeline.$(".TS-notch_active"));var G=H.length;if(this.direction==="next"){F=(E<G?H.eq(E+1):false)}else{F=(E>0?H.eq(E-1):false)}if(!F){return}F.trigger("click")}});m.Api=function(E){this.timeline=E};m.Api.prototype=_.extend(m.Api.prototype,{onLoad:function(E){this.timeline.bind("load",E)},onCardAdd:function(E){this.timeline.bind("cardAdd",E)},onCardActivate:function(E){this.timeline.bind("cardActivate",E)},onBarMove:function(E){this.timeline.bind("move",E)},activateCard:function(E){_(this.timeline.cards).detect(function(F){return F.timestamp===E}).activate()}});m.bindKeydowns=function(){e(document).bind("keydown",function(E){if(m.currentTimeline&&E.keyCode===39){m.currentTimeline.chooseNext.click()}else{if(m.currentTimeline&&E.keyCode===37){m.currentTimeline.choosePrev.click()}else{return}}})};j.boot=function(H,E){var G=m.timeline=new j(H,E||{});var F=new m.Api(G);if(!m.pageTimelines){m.currentTimeline=G;m.bindKeydowns()}m.pageTimelines=m.pageTimelines?m.pageTimelines+=1:1;e(G.render);return{timeline:G,api:F}}})(jQuery);(function(){window.JST=window.JST||{};var a=function(c){var b=new Function("obj","var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+c.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/<%=([\s\S]+?)%>/g,function(d,e){return"',"+e.replace(/\\'/g,"'")+",'"}).replace(/<%([\s\S]+?)%>/g,function(d,e){return"');"+e.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+"__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');");return b};window.JST.card=a('<div class="TS-card_container TS-card_container_<%= (card.get("series") || "").replace(/W/g, "") %>">\n<div class="TS-css_arrow TS-css_arrow_up TS-css_arrow_color_<%= card.get("topcolor") %>"></div>\n  <div class="TS-item TS-item_color_<%= card.get("topcolor") %>" data-timestamp="<%= card.get("timestamp") %>">\n    <div class="TS-item_label">\n      <% if (!_.isEmpty(card.get("html"))){ %>\n        <div class="TS-item_user_html">\n          <%= card.get("html") %>\n        </div>\n      <% } %>\n      <%= card.get("description") %>\n    </div>\n      <% if (!_.isEmpty(card.get("link"))){ %>\n          <a class="TS-read_btn" target="_blank" href="<%= card.get("link") %>">Read More</a>\n      <% } %>\n\n    <div class="TS-item_year">\n      <span class="TS-item_year_text"><%= (card.get("display_date") || "").length > 0 ? card.get("display_date") : card.get("date") %></span>\n      <div class="TS-permalink">&#8734;</div>\n    </div>\n  </div>\n</div>');window.JST.notch=a('<div class="TS-notch TS-notch_<%= timestamp %> TS-notch_<%= series.replace(/W/g, "") %> TS-notch_color_<%= topcolor %>"></div>\n');window.JST.series_legend=a('<div class="TS-series_legend_item TS-series_legend_item_<%= name.replace(/W/g, "") %>">\n  <span class="TS-series_legend_swatch TS-series_legend_swatch_<%= color %>">&nbsp;</span> <span class="TS-series_legend_text"><%= name %></span>\n</div>\n');window.JST.timeline=a('<div class="timeline_setter">\n  <div class="TS-top_matter_container">\n    <div class="TS-controls">\n      <a href="#" class="TS-zoom TS-zoom_in"><span class="TS-controls_inner_text TS-zoom_inner_text">+</span></a> \n      <a href="#" class="TS-zoom TS-zoom_out"><span class="TS-controls_inner_text TS-zoom_inner_text">-</span></a> \n        &nbsp;&nbsp;&nbsp;&nbsp; \n      <a href="#" class="TS-choose TS-choose_prev">&laquo;&nbsp;<span class="TS-controls_inner_text">Previous</span></a> \n      <a href="#" class="TS-choose TS-choose_next"><span class="TS-controls_inner_text">Next</span>&nbsp;&raquo;</a>\n    </div>\n    <div class="TS-series_nav_container"></div>\n  </div>\n\n  <div class="TS-notchbar_container">\n    <div class="TS-notchbar"></div>\n  </div>\n  <div class="TS-card_scroller">\n    <div class="TS-card_scroller_inner">\n    </div>\n  </div>\n</div>');window.JST.year_notch=a('<div class="TS-year_notch TS-year_notch_<%= timestamp %>">\n  <span class="TS-year_notch_year_text"><%= human %></span>\n</div>\n')})();