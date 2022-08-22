import { render, screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import nock from "nock";
import UseFetchExample from "./useFetchExample";



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

    it("should return data", async () => {
        render(<UseFetchExample />);
        expect(await screen.findByText(/Count: 1/i)).toBeInTheDocument()     
    })

    it("should return new when clicked data", async () => {
        render(<UseFetchExample />);
        expect(await screen.findByText(/Count: 1/)).toBeInTheDocument()    
        
        userEvent.click(screen.getByTestId('click')) 
        expect(await screen.findByText(/Count: 2/)).toBeInTheDocument()   

        userEvent.click(screen.getByTestId('reset')) 
        expect(cnt).toEqual(2); // the url should not have been called
        expect(await screen.findByText(/Count: 1/)).toBeInTheDocument() 

        userEvent.click(screen.getByTestId('click')) 
        expect(cnt).toEqual(2); // the url should not have been called
        expect(await screen.findByText(/Count: 2/)).toBeInTheDocument()           
    })

    it("should return new data when refresh is called", async () => {
        render(<UseFetchExample />);
        expect(await screen.findByText(/Count: 1/)).toBeInTheDocument()    
        expect(cnt).toEqual(1); // the url should have been called

        userEvent.click(screen.getByTestId('refetch')) 
        expect(await screen.findByText(/Count: 2/)).toBeInTheDocument()   
        expect(cnt).toEqual(2); // the url should have been called        
    })


})