import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import nock from "nock";
import UseFetchExampleWithExpiry from "./useFetchExampleWithExpiry";



describe("UseFetch Testing", () => {
    let cnt = 0;
    nock('http://localhost')
        .get(uri => uri.includes('test'))
        .times(200)
        .reply(200, () => { 
            return {counter: ++cnt} 
        })
        .persist();

    beforeEach(() => {
        cnt = 0;
    })

    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
      }

    it("should expire after period", async () => {
        render(<UseFetchExampleWithExpiry />);
        expect(await screen.findByText(/Count: 1/)).toBeInTheDocument()    
        
        userEvent.click(screen.getByTestId('click')) 
        expect(await screen.findByText(/Count: 2/)).toBeInTheDocument()   

        sleep(2000);

        userEvent.click(screen.getByTestId('reset')) 
        expect(cnt).toEqual(2); // the url should HAVE been called
        expect(await screen.findByText(/Count: 3/)).toBeInTheDocument() 

        userEvent.click(screen.getByTestId('click')) 
        expect(cnt).toEqual(3); // the url should HAVE been called
        expect(await screen.findByText(/Count: 4/)).toBeInTheDocument()           
    })

})