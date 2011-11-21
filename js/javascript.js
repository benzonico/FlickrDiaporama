$(document).ready(function(){
	$('#tagInputField').keydown(inputKeyDownHandler);
});
var imagesToDisplay;
var currentTag = "";
var pageNumber = 1;
var pageSize =10;
var currentImage;
var imageToRemove;
var imageToFade;
            
function loadImages(pageNum){
	if($('#tagInputField').val()!=currentTag){
		imagesToDisplay = new Array();
		currentTag = $('#tagInputField').val();
		currentImage=null;
		imageToRemove=null;
		imageToFade=null;
		$("#content").empty();
		
		pageNumber = 1;
		pageNum=1;
	}
	$.getJSON('http://api.flickr.com/services/rest/?&nojsoncallback=1',
	  {tags:currentTag,
	  format:"json",
	  api_key:"bf4e37f93e808d75c5345ad678120681",
	  method:"flickr.photos.search",
	  per_page:pageSize,
	  page:pageNum
	  },
	  treat);
}
function inputKeyDownHandler(event){
	  if (event.keyCode == '13') {
		loadImages(pageNumber);
	  }
}
function treat(data) {
	$.each(data.photos.photo, function(i,item){
	  var toAdd = $('<img class="positionImg"/>').attr('src', 'http://farm'+item.farm+'.static.flickr.com/'+item.server+'/'+item.id+'_'+item.secret+'_z.jpg').hide();
	  imagesToDisplay.unshift(toAdd);
	});
	//Start the diaporama only for the first page
	if(pageNumber==1){
		displayImage(30,60);
	}
}

function animate(){
	if(currentImage!=null){
		currentImage.animate({left: '+='+700},{ duration: 3050, queue: false,complete : fadeImageOut});
		imageToFade=currentImage;
		displayImage(30,60);
	}
}

function fadeImageOut(){
	if(imageToFade!=null){
		imageToRemove = imageToFade;
		imageToFade.fadeOut(3000,removeImage);
	}

	
}
function removeImage(){
	if(imageToRemove!=null){
		imageToRemove.remove();
	}
}
function displayImage(x,y){
	if(imagesToDisplay.length<pageSize/2){
		loadImages(++pageNumber);
	}
	currentImage = imagesToDisplay.pop().fadeIn(3100, animate);
	currentImage.css({left:x+'px',top:y+'px'});
	$("#content").append(currentImage);
}