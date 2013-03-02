// Zoom
var controlBar = getElem(im.stage.getContainer()).parent().children('.bottomBar');

var zoom = {};

zoom.in = getElem("<span><i class='icon-plus'></i></span>");
zoom.out = getElem("<span><i class='icon-minus'></i></span>");

zoom.in.appendTo(controlBar);
zoom.out.appendTo(controlBar);

zoom.in.click(function(e){im.fire('zoomInClick',e)});
zoom.out.click(function(e){im.fire('zoomOutClick',e)});

var scale = getElem('<span></span>').addClass('scale').text('100%');
im.on('scaleChange',function(e){
  scale.text(Math.round(im.scale * 10000)/100 + "%");
});
scale.click(function(){
  im.scale = 1;
  im.stage.setScale(im.scale);
  var pos = (im.stage.getDragBoundFunc())({x:im.stage.getX(),y:im.stage.getY()});
  im.stage.setX(pos.x);
  im.stage.setY(pos.y);
  im.fire('scaleChange');
  im.buildBackground();
  im.stage.draw();
})
scale.appendTo(controlBar);

var minScale = 0, maxScale = 3000, stepScale = 5/6;

im.on('zoomInClick',function(e){
  var centerx = (-im.stage.getX() + (im.stage.getWidth() / 2)) / im.scale, 
      centery = (-im.stage.getY() + (im.stage.getHeight() / 2)) / im.scale;
  
  im.scale /= stepScale;
  im.scale = Math.round(im.scale * 1000) / 1000;
  im.alterCore('scale',im.scale);

  var ncenterx = (-im.stage.getX() + (im.stage.getWidth() / 2)) / im.scale, 
      ncentery = (-im.stage.getY() + (im.stage.getHeight() / 2)) / im.scale;
    
  im.stage.setX(im.stage.getX() - (centerx - ncenterx) * im.scale);
  im.stage.setY(im.stage.getY() - (centery - ncentery) * im.scale);

  im.stage.setScale(im.scale);
  
  var pos = (im.stage.getDragBoundFunc())({x:im.stage.getX(),y:im.stage.getY()});
  im.stage.setX(pos.x);
  im.stage.setY(pos.y);

  im.fire('scaleChange');
  im.buildBackground();
  im.stage.draw();
});
im.on('zoomOutClick',function(e){
  var centerx = (-im.stage.getX() + (im.stage.getWidth() / 2)) / im.scale, 
      centery = (-im.stage.getY() + (im.stage.getHeight() / 2)) / im.scale;
  
  im.scale *= stepScale;
  im.scale = Math.round(im.scale * 1000) / 1000;
  im.alterCore('scale',im.scale);

  var ncenterx = (-im.stage.getX() + (im.stage.getWidth() / 2)) / im.scale, 
      ncentery = (-im.stage.getY() + (im.stage.getHeight() / 2)) / im.scale;
    
  im.stage.setX(im.stage.getX() - (centerx - ncenterx) * im.scale);
  im.stage.setY(im.stage.getY() - (centery - ncentery) * im.scale);

  im.stage.setScale(im.scale);
  
  var pos = (im.stage.getDragBoundFunc())({x:im.stage.getX(),y:im.stage.getY()});
  im.stage.setX(pos.x);
  im.stage.setY(pos.y);

  im.fire('scaleChange');
  im.buildBackground();
  im.stage.draw();
});

// Save
var saveSize = {};

saveSize.width = getElem('<input/>');
saveSize.height = getElem('<input/>');
saveSize.both = saveSize.height.add(saveSize.width).width(32);

saveSize.area = getElem('<span/>').css({float:'right',margin:'-5px 14px 0 0'});
saveSize.width.appendTo(saveSize.area);
saveSize.area.append(getElem('<span> x </span>'));
saveSize.height.appendTo(saveSize.area);
saveSize.area.appendTo(controlBar);

var saveButton = $('<button/>').addClass('btn').addClass('btn-primary').text('Save');
saveButton.appendTo(saveSize.area);
saveButton.click(function(){im.save()});


if (im.strictSize) {
  saveSize.both.attr('disabled','true');
} else {
  saveSize.both.keyup(function(){
    im.fire('editedSize');
  });
}

im.bind('editedSize',function(){
  im.saveWidth = parseInt(saveSize.width.val());
  im.saveHeight = parseInt(saveSize.height.val());

  if (isNaN(im.saveWidth)) im.saveWidth = 0;
  if (isNaN(im.saveHeight)) im.saveHeight = 0;

  im.trigger('saveSizeChange');
  im.buildBackground();
});

im.bind('saveSizeChange',function(){
  saveSize.width.val(im.saveWidth);
  saveSize.height.val(im.saveHeight);
});

im.setCursor = function(cursor) {
  $(im.stage.getContainer()).css('cursor',cursor);
};