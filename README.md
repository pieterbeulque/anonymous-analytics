# Anonymous Analytics

There's a way to use Google's [analytics.js](https://developers.google.com/analytics/devguides/collection/analyticsjs/) script in a GDPR- and cookie-friendly manner.

This script loads Google Analytics for you. It then disables all cookies set by Google Analytics & enables the IP anonymization built into GA. The unique client ID is generated by [nanoid](https://github.com/ai/nanoid) and stored in local storage using [storee](https://github.com/pieterbeulque/storee) (if available) or in the history state object using [histore](https://github.com/developit/histore).

The `ga` object is still exposed on `window`, so you can still do any other event tracking. Be careful to keep your GDPR-compliance if you do so. There is currently no option to rename the `ga` global.

## Usage

```html
<script src="anonymous-analytics.js"></script>
<script>
    window.anonymousAnalytics('UA-XXXXXX-XX');
</script>
```

## Browser support

It works on every modern browser and has been tested in IE11. I don't see any reason why it should not work in any older versions of Internet Explorer, but I haven't tested it thoroughly.

## Disclaimer

I am not a lawyer and cannot be held accountable for any wrong advice
