const changeImage = (imgSrc) => {
  const img = document.getElementById("moodImage");
  img.classList.remove("scale");
  img.src = imgSrc;
  img.classList.add("scale");
};
