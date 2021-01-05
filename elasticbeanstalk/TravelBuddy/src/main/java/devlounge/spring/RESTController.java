package devlounge.spring;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.amazonaws.xray.AWSXRay;
import com.amazonaws.xray.entities.Segment;
import com.amazonaws.xray.entities.Subsegment;

import devlounge.spring.model.FlightSpecial;
import devlounge.spring.model.HotelSpecial;
import devlounge.spring.service.FlightSpecialService;
import devlounge.spring.service.HotelSpecialService;


@Controller
public class RESTController {

	private FlightSpecialService flightSpecialService;
	private HotelSpecialService  hotelSpecialService;

	@Autowired(required=true)
	@Qualifier(value="flightSpecialService")
	public void setFlightSpecialService(FlightSpecialService svc){
		this.flightSpecialService = svc;
	}
	
	@Autowired(required=true)
	@Qualifier(value="hotelSpecialService")
	public void setHoteSpecialService(HotelSpecialService svc){
		this.hotelSpecialService = svc;
	}

	// ------------------------
	// PUBLIC METHODS
	// ------------------------
	@RequestMapping(path="/flightspecials", method = RequestMethod.GET)
	@ResponseBody
	public List<FlightSpecial> flightspecials() {
		
		List<FlightSpecial> result = null;
		try {
			Subsegment subsegment = AWSXRay.beginSubsegment(this.getClass().getName() + "::flightspecials");
			result = this.flightSpecialService.findAll();
			subsegment.putMetadata("flightspecials", result);
		}
		catch (Exception ex) {
			
		} 
		finally {
			AWSXRay.endSubsegment();
		}
		
		return result;
	}

	@RequestMapping(path="/hotelspecials", method = RequestMethod.GET)
	@ResponseBody
	public List<HotelSpecial> hotelspecials() {
		
		List<HotelSpecial> result = null;
		try {
			Subsegment subsegment = AWSXRay.beginSubsegment(this.getClass().getName() + "::hotelspecials");
			result = this.hotelSpecialService.findAll();
			subsegment.putMetadata("hotelspecials", result);
		}
		catch (Exception ex) {
			
		} 
		finally {
			AWSXRay.endSubsegment();
		}
		return result;
	}
} 

