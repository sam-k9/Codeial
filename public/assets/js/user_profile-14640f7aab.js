function getImagePreview(e){var t=URL.createObjectURL(e.target.files[0]),c=document.getElementById("preview"),i=document.createElement("img");i.src=t,i.width="150",c.appendChild(i)}