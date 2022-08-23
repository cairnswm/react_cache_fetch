# react_cache_fetch
React library to cache data using fetch

## Installation

```
npm i react-cache-fetch
```

## Usage

In this example a counter is used to change the url being called. Each call therefore returns unique data. If reset is called the counter is reset and cached data will be returned as the url will now match a previously called url.

```javascript
import { useFetch } from "../component/useFetch"
import React, { useState } from 'react';

const UseFetchExample = () => {
    const [click, setclick] = useState(1);
    
    const { status, data, error, refetch, url } = useFetch(`http://localhost/test/?id=${click}`)
    return <div data-testid="usefetchdata">
        <h1>Example</h1>
        {data && data.counter && <span>Count: {data.counter} </span>} 
        <div>
            {data && JSON.stringify(data)}
        </div>
        <div>
            Clicks: {click}
        </div>
        <div>
            {status}
        </div>
        <div>
            {url}
        </div>
        <div>
            {error}
        </div>
        <div>
            <button data-testid="click" onClick={() => {setclick(c => c+1)}}>Fetch</button> 
            <button data-testid="reset" onClick={() => {setclick(1)}}>Reset</button>
            <button data-testid="refetch" onClick={() => {refetch()}}>Refetch</button>
        </div>
    </div>
}

export default UseFetchExample;
```

## Inputs

```javascript
const { status, data, error, refetch, url } = useFetch(`http://localhost/test/?id=${click}`)
```

useFetch takes a single required parameter, a url. Everytime this url is accessed using useFetch the same result will be returned.

useFetch may also recieve a second optional parameter that controls cache options (currently only cache invalidation supported)
useFetch has a third optional parameter that can replace the standard windows.fetch with a customized fetch component (for example a secure fetch that adds required headers before the fetch call is executed).

use Fetch returns
- status - the current status of the fetch request (idle, fetching, fetched, error)
- error - has a value if an error is found during the http call, contains the error message
- data - the data returned from the http call
- refetch - if the data was previously cached, refetch will force a refetch of the data instead of returning the cached value
- url - returns the current url that useFetch is using

## Cache Invalidation

When using useFetch the options object can be used to set an invalidation timeout
```json
{
    "mode":"time",
    "period": 1000
}
```
period is the number of milliseconds before a url will be refetched
