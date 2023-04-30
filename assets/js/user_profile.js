function getImagePreview(event){
    
    var image = URL.createObjectURL(event.target.files[0]);
    var imagediv = document.getElementById('preview');
    var newimg = document.createElement('img');
    newimg.src = image;
    newimg.width='150';
    imagediv.appendChild(newimg);
}