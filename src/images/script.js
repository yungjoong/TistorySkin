var categories = [];

// 전체 글 갯수 구하기
var totalNumberOfPosts = $("a.link_tit > span").text().match(/\(([^)]+)\)/)[1];
categories.push({ "title": "전체보기", "link": "/category", "posts": totalNumberOfPosts, "type": "main", "child": [] });

// 카테고리 구하기
/* Befor
$("ul.category_list > li > a").each(function (index) {
    var category = $.trim($(this).contents().filter(function () { return this.nodeType == 3; })[0].nodeValue);
    var href = $(this).attr('href');
    var numberOfPosts = $(this).find("span").text().match(/\(([^)]+)\)/)[1];

    categories.push([category, href, numberOfPosts]);
}); 
*/

/* After */
$("ul.category_list > li").each(function (index) {

    var category = $.trim($(this).find('a').contents().filter(function () { return this.nodeType == 3; })[0].nodeValue);
    var href = $(this).find('a').attr('href');
    var numberOfPosts = $(this).find("span").text().match(/\(([^)]+)\)/)[1];
    var type = "main";

    var main = { "title": category, "link": href, "posts": numberOfPosts, "type": type, "child": [] };

    var parent = categories.length;

    $(this).find("ul.sub_category_list > li > a").each(function (index) {
        var category = $.trim($(this).contents().filter(function () { return this.nodeType == 3; })[0].nodeValue);
        var href = $(this).attr('href');
        var numberOfPosts = $(this).find("span").text().match(/\(([^)]+)\)/)[1];
        var type = parent;

        main.child.push({ "title": category, "link": href, "posts": numberOfPosts, "type": type });
    });

    categories.push(main);
});

// console.dir(categories);

// 카테고리 메뉴 생성
var listGroup = $('.list-group');
$.each(categories, function (i) {
    var div = $('<div/>')
        .attr('class', 'list-group-item list-group-item-action d-flex justify-content-between align-items-center')
        .appendTo(listGroup)

    // 추가	
    if (categories[i].child.length != 0) {
        var icon = $("<i/>")
            .attr('class', "fa")
            .html('&nbsp;')
    }

    $('<a/>')	// ← 변경 <a/> -> <li/>
        .attr('data-toggle', 'collapse')	// ← 추가
        .attr('data-target', "#" + i)	    // ← 추가
        .attr('aria-expanded', 'false')     // ← 추가
        .attr('aria-controls', i)           // ← 추가
        .appendTo(div)                      // ← 추가
        .prepend(icon);		                // ← 추가

    $('<a/>')	// ← 변경 <a/> -> <li/>
        .attr('class', "mr-auto")
        .attr('href', categories[i].link)
        .text(categories[i].title)
        .appendTo(div)
        .after(function () {
            return $("<span/>")
                .attr('class', "ml-auto badge badge-primary badge-pill") // ← ml-auto 추가
                .text(categories[i].posts)
        })

    if (categories[i].child.length != 0) {
        div = $('<div/>')
            .attr('class', 'collapse show')
            .attr('id', i)
            .appendTo(listGroup)

        // 서브카테고리 추가
        for (var j = 0; j < categories[i].child.length; j++) {
            var li = $('<a/>')
                .attr('class', 'list-group-item list-group-item-action d-flex justify-content-between align-items-center')
                .attr('href', categories[i].child[j].link)
                .attr('id', categories[i].child[j].type)
                .text(categories[i].child[j].title)

            $("#" + categories[i].child[j].type).append(li);

            $("<span/>")
                .attr('class', "ml-auto badge badge-primary badge-pill") // ← ml-auto 추가
                .text(categories[i].child[j].posts)
                .appendTo(li);
        }
    }


});

// 기존의 메뉴 교체
$(".tt_category").remove();

// 태그
if ($("div.tag-container > a") != null) {
    var tags = [];
    $("div.tag-container > a").each(function (index) {

        var tag = $.trim($(this).text());
        var href = $(this).attr('href');
        tags.push([tag, href]);
    });

    var listGroup = $("div.tag-container").empty();
    $.each(tags, function (i) {
        var a = $('<a/> ')
            .attr('class', 'badge badge-primary mr-1')
            .attr('href', tags[i][1])
            .text(tags[i][0])
            .appendTo(listGroup);
    });

    // 신고버튼 교체
    var reportAbuseButton = $('a[href*="abuseReport"]');
    var newReportAbuseButton = $("#reportAbuse");

    newReportAbuseButton.attr("href", reportAbuseButton.attr('href'));
    newReportAbuseButton.attr("onclick", reportAbuseButton.attr('onclick'));
    reportAbuseButton.parent().remove();

    // pagination 교체
    $(".no-more-prev").addClass("disabled");
    $(".no-more-next").addClass("disabled");
    $("a.page-link > span.selected").parent().attr("href", "#")
    $("a.page-link > span.selected").parent().parent().addClass('active');

    // 검색결과 없을 때 보여주기
    if ($(".article-card").length == 0 && $(".article-content").length == 0) {
        $('<div class="alert alert-info" role="alert">No search results</div>').appendTo($(".article-base"));

    }
}

/**********************************************/
/* 20.02.19 Copy to ClipBoard 버튼 추가
/**********************************************/
var pre = document.getElementsByTagName('pre');

for (var i = 0; i < pre.length; i++) {
    var button = document.createElement('button');
    button.className = 'copy-btn';
    button.setAttribute('type', 'button');
    button.setAttribute('title', 'Copy to clipboard');  // Contents of ToolTip

    var img = document.createElement('img');
    img.className = "clippy";
    img.setAttribute('width', '13');
    img.setAttribute('src', 'https://tistory3.daumcdn.net/tistory/1888377/skin/images/clippy.svg');
    img.setAttribute('alt', 'Copy to clipboard');
    button.appendChild(img);

    pre[i].appendChild(button);
}

var copyCode = new ClipboardJS('.copy-btn', {
    target: function (trigger) {
        return trigger.previousElementSibling;
    }
});

copyCode.on('success', function (event) {
    event.clearSelection();

    showTooltip(event.trigger, 'Copied!');

    // console.info('Action:', event.action);
    // console.info('Text:', event.text);
    // console.info('Trigger:', event.trigger);

    window.setTimeout(function () {
        event.trigger.setAttribute('title', 'Copy to clipboard');
    }, 2000);
});

copyCode.on('error', function (event) {
    event.trigger.textContent = 'Press "Ctrl + C" to copy';
    window.setTimeout(function () {
        event.trigger.textContent = 'Copy';
    }, 2000);
});

// Tooltips
var btns = document.querySelectorAll('.copy-btn');
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('mouseleave', clearTooltip);
    btns[i].addEventListener('blur', clearTooltip);
}

function clearTooltip(event) {
    event.currentTarget.setAttribute('class', 'copy-btn');
    event.currentTarget.removeAttribute('aria-label');
}

function showTooltip(elem, msg) {
    elem.setAttribute('class', 'copy-btn tooltipped tooltipped-s');
    elem.setAttribute('aria-label', msg);
}

function fallbackMessage(action) {
    var actionMsg = '';
    var actionKey = (action === 'cut' ? 'X' : 'C');
    if (/iPhone|iPad/i.test(navigator.userAgent)) {
        actionMsg = 'No support :(';
    } else if (/Mac/i.test(navigator.userAgent)) {
        actionMsg = 'Press ⌘-' + actionKey + ' to ' + action;
    } else {
        actionMsg = 'Press Ctrl-' + actionKey + ' to ' + action;
    }
    return actionMsg;
}



/**********************************************/
/* back to top 버튼 추가
/**********************************************/
$(document).ready(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('#back-to-top').tooltip();
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
            $('#back-to-top').tooltip('hide');
        }
    });
    // scroll body to 0px on click
    $('#back-to-top').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });
});