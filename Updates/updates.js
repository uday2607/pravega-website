let timeline = document.querySelector(".timeline"),
  jsonResponse = [{
    postedDate: "11th and 12th July, 2020",
    postedTime: "",
    postedContent: "Technical events",
    postedLink: "workshops/workshops.html",
    postedTitle: "Workshops",
    postedIcon: "lightbulb"
  },
  {
    postedDate: "7th July, 2020",
    postedTime: "",
    postedContent: "Art competition",
    postedLink: "",
    postedTitle: "Oh Doodles!",
    postedIcon: "mobile"
  },
  ];

jsonResponse.forEach((item, index) => {
  let {
    postedDate,
    postedTime,
    postedContent,
    postedLink,
    postedTitle,
    postedIcon } =
    item;

  let even = index % 2 === 0;

  timeline.innerHTML += ` <article class = "${even ? 'timeline-item' : 'timeline-item alt'}">
          <div class="timeline-desk">
              <div class="panel">
                  <div class="panel-body">
                      <span class="timeline-icon">
                          <i class="icon-${postedIcon}"></i>
                      </span>
                      <h1 class="text-uppercase">${postedDate}</h1>
                      <h1 class="text-uppercase">${postedTime}</h1>
                      <p style = "font-size:18px"><a href="${postedLink}">${postedTitle}</a> ${postedContent}</p>
                  </div>
              </div>
          </div>
      </article>`;
});
