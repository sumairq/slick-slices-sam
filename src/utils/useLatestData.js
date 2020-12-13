import React,{useEffect, useState} from 'react'

const gql = String.raw;  

const deets  =`

    name  
    _id
    image {
        asset {
            url
            metadata {
                lqip  
            }
        }
    }

    `

export default function useLatestData(){
    //hot slices
    const [hotSlices, setHotSlices] = useState();

    //slicemasters
    const [slicemasters, setSlicemasters] = useState();
    // Use a side effect to fetch the data from the graphql endpoint

    useEffect(function(){
        //When the component loads, fetch the data
       fetch(process.env.GATSBY_GRAPHQL_ENDPOINT,{
           method: 'POST',
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify({
               query: gql`
               query{
                StoreSettings(id: "downtown"){
                  name
                  slicemasters{
                   ${deets}
                    }
                hotSlices{
                 ${deets}
                  }
                }
              }
               `,
           })
       }).then(res => res.json()).then(res=>{
           //Todo:  Check for errors
           //set the data to state
          setHotSlices(res.data.StoreSettings.hotSlices);
          setSlicemasters(res.data.StoreSettings.slicemasters);
       })
    }, []);

    return {
        hotSlices,
        slicemasters
    }
}