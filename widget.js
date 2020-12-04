class Widget {
    // Запускаем виджет
    init() {
        this.getNews();
        this.addWidget();
        this.addStyles();
    }
    // Добавляем виджет на страницу
    addWidget() {
        const wdg = document.createElement("div");
        wdg.classList.add("widget");
        wdg.innerHTML = `
            <span>News</span>
            <div class='wgt-counter wgt-counter--active'><span>6</span></div>
        `;
        document.body.insertAdjacentElement("beforeend", wdg);
    }
    // ф-я рендера списка новостей
    addWidgetWindow({ articles }) {
        const wdgWindow = document.createElement("div");
        wdgWindow.classList.add("widget-window");
        wdgWindow.innerHTML = `
            <div class="widget-window__title"><span>Список последних новостей</span></div>
            <div class="widget-window__list">
                ${articles
                    .map((news, index) => {
                        return `
                    <div id=${index} class='wgt-news'>
                        <h5 class='wgt-news__title'>${news.title}</h5>
                        <span class="wgt-news__author">Автор: ${
                            news.source.name
                        }</span>
                        <a href="${
                            news.url
                        }" class="wgt-news__link">Подробности</a>
                        <span class="wgt-news__date">${news.publishedAt.slice(
                            0,
                            10
                        )}</span>
                        <span class="wgt-news__status"></span>
                    </div>
                    <hr>
                    `;
                    })
                    .join(" ")}                
        `;
        document.body.insertAdjacentElement("beforeend", wdgWindow);
    }
    // В тег head добавляем тег style с кастомными стилями для виджета
    addStyles() {
        const widgetStyles = document.createElement("style");
        widgetStyles.textContent = `
            .widget {
                position: fixed;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                height: 50px;
                right: 15px;
                bottom: 20px;
                background-color: rgb(29, 38, 160);
                border-radius: 50%;
                z-index: 200;
                cursor: pointer;
                transition: all 0.3s;
            }
            .widget:hover {
                opacity: 0.9;
            }
            .widget span {
                font-size: 12px;
                color: #ffffff;
            }
            
            .widget-window {
                overflow: hidden;
                position: fixed;
                display: flex;
                flex-direction: column;
                right: 50px;
                bottom: 50px;
                max-width: 320px;
                width: 80%;
                max-height: 400px;
                height: 80%;
                background-color: #fff;
                border-radius: 20px;
                padding: 30px 10px 10px;
                -webkit-box-shadow: 3px 7px 20px 0px rgba(34, 60, 80, 0.2);
                -moz-box-shadow: 3px 7px 20px 0px rgba(34, 60, 80, 0.2);
                box-shadow: 3px 7px 20px 0px rgba(34, 60, 80, 0.2);
                transform: scale(0);
                transform-origin: right bottom;
                transition: all 0.4s;
                z-index: 150
            }
            .widget-window.wgt-active {
                transform: scale(1);
            }
            .widget-window__title {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;                
                font-size: 14px;
                font-weight: bold;
                background-color: rgb(50, 128, 218);
                color: #fff;
            }
            .widget-window__list {
                width: 100%;                
                flex-grow: 1;
                padding: 10px 0px;
                overflow-y: scroll;
            }
            .widget-window__list::-webkit-scrollbar {
                width: 0;
            }
            .wgt-news {
                position: relative;
                display: flex;
                flex-direction: column;
                padding: 5px 10px 5px 0px;
            }
            .wgt-news span {
                text-align: left;
            }
            .wgt-news__title {
                font-size: 15px;
                margin-bottom: 5px;
            }
            .wgt-news__author {
                font-weight: 700;
                font-size: 13px;
                margin-bottom: 3px;
            }           
            .wgt-news__link {
                text-decoration: none;
                font-size: 13px;
                font-weight: 700;
                margin-bottom: 3px;
                color: #2860aa;
                transition: all 0.3s;
            }
            .wgt-news__link:hover {
                opacity: 0.9;
            }
            .wgt-news__date {
                font-size: 12px;
                color: rgb(124, 124, 124);
            }
            .wgt-news__status {
                position: absolute;
                right: 0px;
                top: 10px;
                width: 10px;
                height: 10px;
                background-color: tomato;
                border-radius: 50%;
            }
            .wgt-counter {
                position: absolute;
                top: -5px;
                right: 5px;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background-color: tomato;
                color: #fff;
                transform: scale(0);
                transition: all 0.3s;
            }
            .wgt-counter.wgt-counter--active {
                transform: scale(1);
            }
        `;
        document.head.insertAdjacentElement("afterbegin", widgetStyles);
    }
    // получаем список новостей
    getNews() {
        fetch("db.json")
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                const counter = document.querySelector(".wgt-counter>span");
                // устанавливаем в счетчик количество новых новостей
                counter.textContent = data.totalResults;
                // запускаем рендер и ф-ю для работы с элементами DOM списка
                this.addWidgetWindow(data);
                this.openNews();
            });
    }
    // Навешиваем события на открытие ссылок и списка новостей
    openNews() {
        const btn = document.querySelector(".widget");
        const widgetWindow = document.querySelector(".widget-window");
        const counter = document.querySelector(".wgt-counter");
        const newsLink = document.querySelectorAll(".wgt-news__link");

        newsLink.forEach((link, index) => {
            link.addEventListener("click", (e) => {
                const status = document.querySelectorAll(".wgt-news__status");

                if (!e.target.hasAttribute("target")) {
                    e.preventDefault();
                    e.target.setAttribute("target", "_blank");
                    e.target.click();
                }

                status[index].style.backgroundColor = "green";
            });
        });

        btn.addEventListener("click", () => {
            widgetWindow.classList.toggle("wgt-active");
            counter.classList.toggle("wgt-counter--active");
        });
    }
}
// после загрузки страницы инициализируем виджет
document.addEventListener("DOMContentLoaded", () => {
    const widget = new Widget();
    widget.init();
});
