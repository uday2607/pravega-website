var project = $('.project');
var pLink = project.find('.project__link');
var pBg = project.find('.project__bg-item');

var changeBg = function() {
  var thisProject = $(this);
  var thisProjectIndex = thisProject.parent().index();
  var thisProjectBg = pBg.eq(thisProjectIndex);
  
  // hide all backgrounds and fade out project names
  pBg.removeClass('project__bg-item--active');
  pLink.css('opacity', '0.4');
  
  // reveal the project bg you hovered over and increase opacity for that name
  thisProject.css('opacity', '1');
  thisProjectBg.addClass('project__bg-item--active');
};

var showFirst = function() {
  // when the page loads reveal the first project
  pLink.css('opacity', '0.4');
  pLink.parent().first().children().css('opacity', '1');
  pBg.first().addClass('project__bg-item--active');
}

var init = function() {
  $(document).on('ready', showFirst);
  pLink.on('mouseenter', changeBg);
};

init();