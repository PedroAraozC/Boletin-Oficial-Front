import axiosOriginal from 'axios'

const axios = axiosOriginal.create({
    // baseURL: "IP SERVIDOR PRODUCCION:PUERTO DEL BACK-END"
    // baseURL: "http://181.105.6.205:89" //SERVIDOR DE PRODUCCION
    baseURL: "http://localhost:3001"
})

export default axios;