(function() {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    var app = 'G-69MKFCH3SX';
    gtag('js', new Date());
    var hrefSplit = window.location.href.split('?');
    gtag('config', app, {anonymize_ip: true, cookie_domain: 'auto', cookie_flags: 'SameSite=none;Secure', 'debug_mode': true, page_location_clean: hrefSplit[0], page_name: n2__getPageNameFromHref(hrefSplit), page_lightning: n2__isHrefLightning(hrefSplit)});
    var script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + app;
    script.defer = 'defer';
    document.body.appendChild(script);
})();
function n2__logDETabView(tabName) {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}

    var hrefSplit = window.location.href.split('?');
    var isLightning = n2__isHrefLightning(hrefSplit);
    var pageName = n2__getPageNameFromHref(hrefSplit);
    tabName = '__' + tabName;
    hrefSplit.splice(1, 0, tabName + '?');
    var href = hrefSplit.join('');
    
    gtag('event', 'page_view', {page_title: document.title, page_location: href, page_location_clean: hrefSplit[0] + tabName, page_name: pageName + tabName, page_lightning: isLightning});
}
function n2__getPageNameFromHref(hrefSplit) {
    var parts = hrefSplit[0].split('/');
    return parts[parts.length - 1];
}
function n2__isHrefLightning(hrefSplit) {
    return hrefSplit.length > 1 && hrefSplit[1].indexOf('ltn_app_id=') !== -1;
}