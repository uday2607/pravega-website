let timeline = document.querySelector(".timeline"),
jsonResponse = [{
  postedDate: "29th Nov, 2019",
  postedTime: "18:22",
  postedContent: "blah blah blah",
  postedLink: "www.pravega.com",
  postedTitle: "Post One" }];


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
