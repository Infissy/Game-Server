import WebSocket = require("ws")
import { ENDPOINTS, MessageFactory } from "../source/properties/properties.network"
import axios from "axios"
import {EventCategory} from "../source/entities/message"
import { Message, InfoType } from "../source/entities/message"
import { Client, RequestParameterType } from "../source/entities/client"
import {Card} from "../source/entities/card"
import { expectType } from "ts-expect"
import { expect } from "chai"


interface JWT {
  JWT_Token: string;
}



describe("PlayerInitialization", () => {
  it("DeckInitialization", (done) => {
    
    let wsServer: WebSocket.Server = new WebSocket.Server({
      port : Math.floor(Math.random() * 3000) + 3000
    });
    let port :number = wsServer.options.port ?? 3000;
    try {
      
      let url = ENDPOINTS.LOGIN;

      wsServer.on('connection', (ws) => {
          
        axios
          .post(url,
            {
              username: 'Admin',
              password: 'Admin'
            }
          )
          .then(res => {
        
            expect(res.status).equal(200);
              
            expectType<JWT>(res.data)

            let client: Client = new Client(ws, res.data.JWT_TOKEN);
            
            client.RequestParameter(RequestParameterType.Deck).then((deckID) => {
              
           
              
              client.GetCards(deckID as number, 0).then((res) => {
                    
                expectType<Array<Card>>(res);
              
                console.table(res);

                done();
                wsServer.close();
              });

            })
              
          })


      })
    } catch (err) {
        
       
      wsServer.close();
      console.log(err);
    }
  
    



    
    let wsClient: WebSocket = new WebSocket('ws://localhost:' + port);



    
    wsClient.on("message", (deckRequest : string) => {
    
      let message: Message = JSON.parse(deckRequest);
      if (message.EventType === EventCategory.Request) {
        
        let response: Message = { EventType: EventCategory.Request, Event: InfoType.PlayerDeck, Flag: 2 };
        wsClient.send(MessageFactory(response));
      }

    })

    
  
      
    })

    






  it("Should Receive Cards",(done)=> {
    
      let ws: WebSocket = new WebSocket('ws://localhost:'+process.env.PORT);
      
  

          let url = ENDPOINTS.LOGIN;
      
    axios
      .post(url,
        {
          username: 'Admin',
          password: 'Admin'
        }
      )
      .then(res => {

        expect(res.status).equal(200);
           
        expectType<JWT>(res.data)

        let client: Client = new Client(ws, res.data.JWT_TOKEN);
        

        client.GetCards(2,0).then((res) => {
              
          expectType<Array<Card>>(res);
          console.log(res);
          done();
        });
      
              


      }).catch((err) => {
        console.log(err);      
      })


    })

      
      
  
     
              



  })

