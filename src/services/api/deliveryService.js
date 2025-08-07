import deliverySlotsData from "@/services/mockData/deliverySlots.json";
import { format, addDays } from "date-fns";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateDynamicSlots = () => {
  const slots = [];
  const today = new Date();
  const times = ["09:00", "11:00", "14:00", "16:00", "18:00"];
  
  // Generate slots for the next 7 days
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = addDays(today, dayOffset);
    const dateString = format(date, "yyyy-MM-dd");
    
    times.forEach((time, timeIndex) => {
      // Randomly make some slots unavailable for realism
      const available = Math.random() > 0.15; // 85% availability
      
      slots.push({
        Id: (dayOffset * times.length) + timeIndex + 1,
        date: dateString,
        time: time,
        available: available
      });
    });
  }
  
  return slots;
};

const deliveryService = {
  async getAvailableSlots() {
    await delay(300);
    // Use dynamic slots for a more realistic experience
    return generateDynamicSlots();
  },

  async getSlotById(id) {
    await delay(200);
    const slots = generateDynamicSlots();
    const slot = slots.find(s => s.Id === parseInt(id));
    if (!slot) {
      throw new Error(`Delivery slot with Id ${id} not found`);
    }
    return { ...slot };
  },

  async reserveSlot(slotData) {
    await delay(400);
    // In a real app, this would mark the slot as reserved
    return {
      success: true,
      reservationId: `RES-${Date.now()}`,
      slot: { ...slotData }
    };
  },

  async getSlotsByDate(date) {
    await delay(250);
    const slots = generateDynamicSlots();
    return slots.filter(slot => slot.date === date);
  }
};

export default deliveryService;