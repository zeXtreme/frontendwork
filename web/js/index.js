//课程列表模块
/**
 * 设置课程列表的页码表
 * @param pagination
 */
function setPageList(pagination) {
    lessonStatus.totlePageCount = pagination.totlePageCount;
    //var currIndex = pagination.pageIndex;
    var currIndex = lessonStatus.pageNo;
    var showPageNum = pagination.totlePageCount > 8 ? 8 : pagination.totlePageCount;
    var start = currIndex < 5 ? 1 : currIndex - 4;
    start = start > pagination.totlePageCount - 7 ? pagination.totlePageCount - 7 : start;
    var ul = $('.g-left .m-page ul');
    ul.empty();
    for (var i = start, count = 0; count < showPageNum; i++, count++) {
        if (i == currIndex) {
            ul.append('<li class=\'selected\'>' + i + '</li>');
            //li.className = 'selected';
        } else {
            ul.append('<li>' + i + '</li>');
        }
        if (i == pagination.totlePageCount) {
            break;
        }
    }
}

$('.m-page .u-prev').click(function () {
    lessonStatus.setPageNo(lessonStatus.pageNo - 1);
});

$('.m-page .u-next').click(function () {
    lessonStatus.setPageNo(lessonStatus.pageNo + 1);
});

/**
 * 设置课程列表
 * @param list
 */
function setLessonList(list) {
    while (lessonList.length > 0) {
        lessonList.pop().remove();
    }
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var clone = $('.m-main .m-lesson .m-item-container.template').clone();
        clone.appendTo($('.m-main .m-lesson'));
        var m_item = clone.children();
        clone.removeClass('template');
        m_item.children('img').attr('src', item.middlePhotoUrl);
        m_item.children('h3').text(item.name);
        m_item.children('.u-author').text(item.provider);
        m_item.children('.u-person').text(item.learnerCount);
        m_item.children('.u-money').text('￥' + item.price.toFixed(2));
        m_item.children('.u-cate').text(item.categoryName);
        m_item.children('.u-desc').children().text(item.description);
        lessonList.push(clone);
    }
}

/**
 * 获取数据并设置列表
 * @param pageNo
 * @param psize
 * @param type
 */
function setLessonListData(pageNo, psize, type) {
    var url = 'http://study.163.com/webDev/couresByCategory.htm?pageNo=' + pageNo + '&psize=' + psize + '&type=' + type;
    console.log(url);
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                setLessonList(data.list);
                setPageList(data.pagination);
            }
        }
    }
}

var lessonStatus = {pageNo: 1, psize: 20, type: 10};

lessonStatus.setPageNo = function (pageNo) {
    if (this.pageNo != pageNo && pageNo > 0 && (lessonStatus.totlePageCount ? pageNo <= lessonStatus.totlePageCount : true)) {
        this.pageNo = pageNo;
        setLessonListData(this.pageNo, this.psize, this.type);
    }
}

lessonStatus.setType = function (type) {
    if (this.type != type) {
        $('.g-left .m-cate').children().each(function () {
            $(this).toggleClass('selected');
        });
        this.type = type;
        this.pageNo = 1;
        setLessonListData(this.pageNo, this.psize, this.type);
    }
}

var lessonList = [];
setLessonListData(lessonStatus.pageNo, lessonStatus.psize, lessonStatus.type);

$('.g-left .m-page ul').click(function (event) {
    var target = event.originalEvent.target || event.originalEvent.srcElement;
    if (target.tagName == 'LI') {
        var newPageNo = $(target).text();
        console.log('page:' + newPageNo);
        lessonStatus.setPageNo(newPageNo);
    }
});

$('.g-left .m-cate').click(function (event) {
    var target = event.originalEvent.target || event.originalEvent.srcElement;
    if (target.tagName == 'LI') {
        lessonStatus.setType($(target).attr('type'));
    }
});

//图片轮播模块
/**
 * 切换banner图片
 * @param imgIndex
 */
function picChange(imgIndex) {
    $('.g-banner').children('a').each(function (index) {
        console.log('index=' + index);
        console.log('imgIndex=' + imgIndex);
        if (index == imgIndex) {
            var self = $(this);
            $(this).addClass('show');
            var op = 0;
            $(this).css('opacity', op);
            var fadein = setInterval(function () {
                op += 0.1;
                //0.7+0.1=0.7999999?
                self.css('opacity', op.toFixed(1));
                if (op.toFixed(1) >= 1) {
                    clearInterval(fadein);
                }
            }, 50);
        } else {
            $(this).removeClass('show');
            console.log('index ' + index + ' hide');
        }
    });
    $('.g-banner .u-pointer').children().each(function () {
        if ($(this).attr('index') == imgIndex) {
            $(this).addClass('curr');
        } else {
            $(this).removeClass('curr');
        }
    });
}

var imgIndex = 0;

var imgId = setInterval(function () {
    imgIndex = imgIndex + 1 > 2 ? 0 : imgIndex + 1;
    picChange(imgIndex);
}, 5000);

$('.g-banner').hover(function () {
    clearInterval(imgId);
}, function () {
    imgId = setInterval(function () {
        imgIndex = imgIndex + 1 > 2 ? 0 : imgIndex + 1;
        picChange(imgIndex);
    }, 5000);
});

$('.g-banner .u-pointer').click(function (event) {
    var target = event.originalEvent.target || event.originalEvent.srcElement;
    if (target.tagName == 'I') {
        imgIndex = parseInt($(target).attr('index'));
        picChange(imgIndex);
    }
});

//提示条模块
$('.g-tips .u-close').click(function () {
    setCookie('no_alert', '1', new Date(9999, 11, 31).toUTCString());
    //document.cookie = "no_alert=1;expires=" + new Date(9999,12,31).toUTCString();
    $('.g-tips').hide();
});

if (getCookie('no_alert') == '1') {
    $('.g-tips').hide();
}

/**
 * 设置一个cookie
 * @param name
 * @param value
 * @param expires
 */
function setCookie(name, value, expires) {
    document.cookie = name + '=' + value + (expires ? ';expires=' + expires : '');
}

/**
 * 获取一个cookie
 * @param name
 * @returns {string}
 */
function getCookie(name) {
    var arr = document.cookie.split(';');
    var value = '';
    for (var i = 0; i < arr.length; i++) {
        var nvs = arr[i].split('=');
        var reg = new RegExp('\s?' + name + '\s?');
        if (reg.test(nvs[0])) {
            value = nvs[1];
        }
    }
    return value;
}

//对话框
$('.g-right .u-intro a').click(function () {
    $('.m-mask').show();
    $('.m-dialog.u-video').show();
});

$('.m-dialog .u-close').click(function () {
    $('.m-mask').hide();
    $('.m-dialog.u-login').hide();
    $('.m-dialog.u-video').hide();
});

//关注模块
function follow() {
    if (getCookie('loginSuc') == '1') {
        var xhr = new XMLHttpRequest();
        xhr.open('get', 'http://study.163.com/webDev/attention.htm', true);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    if (xhr.responseText == '1') {
                        $('.g-header .u-follow').off('click');
                        setCookie('followSuc', '1', new Date(9999, 11, 31).toUTCString());
                        $('.g-header .u-follow').addClass('followed');
                        $('.g-header .u-follow .u-cancel').click(unfollow);
                    }
                }
            }
        }
    } else {
        var validate = false;
        $('.m-dialog.u-login form').children('input').each(function () {
            $(this).val('');
            $(this).blur(function (event) {
                if (/^[a-zA-Z][a-zA-Z0-9_\.]{4,15}$/.test($(event.currentTarget).val())) {
                    $(event.currentTarget).removeClass('novalidate');
                    validate = true;
                } else {
                    $(event.currentTarget).addClass('novalidate');
                    validate = false;
                }
            });
        });
        $('.m-dialog.u-login form').submit(function (event) {
            event.preventDefault();
            if (validate) {
                var userName = $(event.currentTarget['userName']).val();
                var password = $(event.currentTarget['password']).val();
                var xhr = new XMLHttpRequest();
                xhr.open('get', 'http://study.163.com/webDev/login.htm?userName=' + $.md5(userName) + '&password=' + $.md5(password), true);
                xhr.send();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            if (xhr.responseText == '1') {
                                setCookie('loginSuc', '1');
                                $('.m-mask').hide();
                                $('.m-dialog.u-login').hide();
                            } else {
                                alert('用户名密码不匹配！');
                            }
                        }
                    }
                }
            }
        });
        $('.m-mask').show();
        $('.m-dialog.u-login').show();
    }
}

function unfollow(event){
    $('.g-header .u-follow .u-cancel').off('click');
    setCookie('followSuc', '0');
    $('.g-header .u-follow').removeClass('followed');
    $('.g-header .u-follow').click(follow);
    event.stopPropagation();
}

if (getCookie('followSuc') == '1') {
    $('.g-header .u-follow').addClass('followed');
    $('.g-header .u-follow .u-cancel').click(unfollow);
}else {
    $('.g-header .u-follow').click(follow);
}


//最热排行模块
function setRankListData() {
    var url = 'http://study.163.com/webDev/hotcouresByCategory.htm';
    console.log(url);
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                console.log(data);
                setRankList(data);
            }
        }
    }
}

var showRankList = [];
var hideRankList = [];

function setRankList(rankList) {
    var showRankListNum = 10;
    for (var i = 0; i < rankList.length; i++) {
        var item = rankList[i];
        var clone = $('.g-right .u-rank li.template').clone();
        clone.removeClass('template');
        clone.children('img').attr('src', item.middlePhotoUrl);
        clone.children('div').children('h3').text(item.name);
        clone.children('div').children('span').text(item.learnerCount);
        if (i < showRankListNum) {
            clone.appendTo($('.g-right .u-rank .m-ranklist'));
            showRankList.push(clone);
        } else {
            hideRankList.push(clone);
        }
    }
    setInterval(function () {
        var showItem = hideRankList.shift();
        var hideItem = showRankList.shift();
        showItem.appendTo($('.g-right .u-rank .m-ranklist'));
        var itemHeight = 70;
        var currMargin = 0;
        var scroll = setInterval(function () {
            if (currMargin > -(itemHeight)) {
                $('.g-right .u-rank .m-ranklist').css('margin-top', currMargin -= 5);
            } else {
                hideItem.remove();
                $('.g-right .u-rank .m-ranklist').css('margin-top', 0);
                clearInterval(scroll);
            }
        }, 50);
        showRankList.push(showItem);
        hideRankList.push(hideItem);
    }, 5000);
}

setRankListData();