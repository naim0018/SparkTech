const steadFastApi = {
    baseUrl: "https://portal.packzy.com/api/v1",
    token: process.env.REACT_APP_STEADFAST_API_TOKEN,
  
    // Get all available cities
    async getCities() {
      try {
        const response = await fetch(`${this.baseUrl}/get_cities`, {
          method: 'GET',
          headers: {
            'api-key': this.token,
            'Content-Type': 'application/json'
          }
        });
        return await response.json();
      } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
      }
    },
  
    // Get zones for a specific city
    async getZones(cityId) {
      try {
        const response = await fetch(`${this.baseUrl}/get_zones/${cityId}`, {
          method: 'GET',
          headers: {
            'api-key': this.token,
            'Content-Type': 'application/json'
          }
        });
        return await response.json();
      } catch (error) {
        console.error('Error fetching zones:', error);
        throw error;
      }
    },
  
    // Create a parcel delivery order
    async createParcel(parcelData) {
      try {
        const response = await fetch(`${this.baseUrl}/create_order`, {
          method: 'POST',
          headers: {
            'api-key': this.token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(parcelData)
        });
        return await response.json();
      } catch (error) {
        console.error('Error creating parcel:', error);
        throw error;
      }
    },
  
    // Track parcel status
    async trackParcel(trackingId) {
      try {
        const response = await fetch(`${this.baseUrl}/track_parcel/${trackingId}`, {
          method: 'GET',
          headers: {
            'api-key': this.token,
            'Content-Type': 'application/json'
          }
        });
        return await response.json();
      } catch (error) {
        console.error('Error tracking parcel:', error);
        throw error;
      }
    },
  
    // Calculate delivery charge
    async calculateCharge(data) {
      try {
        const response = await fetch(`${this.baseUrl}/calculate_charge`, {
          method: 'POST',
          headers: {
            'api-key': this.token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        return await response.json();
      } catch (error) {
        console.error('Error calculating charge:', error);
        throw error;
      }
    }
  };
  
  export default steadFastApi;
  