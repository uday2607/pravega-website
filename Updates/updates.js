let timeline = document.querySelector(".timeline"),
jsonResponse = [{
  postedDate: "11th Dec, 2019",
  postedTime: "23:00",
  postedContent: "Bangalore Regional Finals Over",
  postedLink: "www.pravega.com",
  postedTitle: "Battle of Bands" }];


jsonResponse.forEach((item, index) => {
  let {
    postedDate,
    postedTime,
    postedContent,
    postedLink,
    postedTitle } =
  item;

  let even = index % 2 === 0;

  timeline.innerHTML += ` <article class="timeline-item alt">
          <div class="timeline-desk">
              <div class="panel">
                  <div class="panel-body">
                      <span class="timeline-icon">
                          <i class="icon-mobile"></i>
                      </span>
                      <h1 class="text-uppercase">${postedDate}</h1>
                      <h1 class="text-uppercase">${postedTime}</h1>
                      <p style = "font-size:18px"><a href="${postedLink}">${postedTitle}</a> ${postedContent}</p>
                  </div>
              </div>
          </div>
      </article>`;
});
