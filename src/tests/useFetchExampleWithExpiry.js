import { useFetch } from "../component/useFetch"
import React, { useState } from 'react';

const UseFetchExampleWithExpiry = () => {
    const [click, setclick] = useState(1);
    
    const { status, data, error, refetch, url } = useFetch(`http://localhost/test/?id=${click}`, {mode: "time", period:1})
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
            <button data-testid="refetch" onClick={() => {refetch()}}>Reset</button>
        </div>
    </div>
}

export default UseFetchExampleWithExpiry;