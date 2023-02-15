const express = require('express')
const app = express()

const rooms = []
const bookings = []
const customers = {}

app.use(express.json())

app.post('/create-room',(req,res)=>{
    const { seats, amenities, price_per_hour} = req.body;
    const newRoom = { id: rooms.length+1, seats, amenities, price_per_hour, bookings:[]};
    rooms.push(newRoom)
    res.send(`Room is booked`)
})

app.post('/book-room',(req,res)=>{
    const { customer_name, date, start_time, end_time, room_id} = req.body;
    const room = rooms.find((r)=> r.id === room_id);
    if(room){
        const newBooking = {customer_name, date, start_time, end_time, room};
        room.bookings.push(newBooking)
        bookings.push(newBooking)
        res.json("Booking confirmed")
    }else{
        res.status(404).send("Room not found")
    }
})

app.get('/rooms',(req,res)=>{
    const roomData = rooms.map((room)=>{
        const isBooked = room.bookings.length>0;
        const roomInfo = {name : `Room ${room.id}`, booked: isBooked};

        if(isBooked){
            roomInfo.bookings = room.bookings.map((booking)=>{
                return{
                    customer_name: booking.customer_name,
                    date: booking.date,
                    start_time: booking.start_time,
                    end_time : booking.end_time
                }
            })
        }
        return roomInfo
    })
    res.json(roomData)
})

app.get('/customers',(req,res)=>{
    for (const booking of bookings){
        const customer_name = booking.customer_name;

        if (!customers[customer_name]){
            customers[customer_name]={
                bookings:[]
            }
        }

        customers[customer_name].bookings.push({
            room_name: `Room ${booking.room.id}`,
            date: booking.date,
            start_time: booking.start_time,
            end_time:booking.end_time
        })
    }
    res.json(customers)
})


app.listen('3000',()=>{
    console.log('Server is running on port 3000')
})