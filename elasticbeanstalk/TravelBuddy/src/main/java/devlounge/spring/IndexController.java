package devlounge.spring;

import devlounge.spring.service.FlightSpecialService;
import devlounge.spring.service.HotelSpecialService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("IndexController")
public class IndexController {

	private FlightSpecialService flightSpecialService;
	private HotelSpecialService hotelSpecialService;
	
	@Autowired(required=true)
	@Qualifier(value="flightSpecialService")
	public void setFlightSpecialService(FlightSpecialService svc){
		this.flightSpecialService = svc;
	}

	@Autowired(required=true)
	@Qualifier(value="hotelSpecialService")
	public void setFlightSpecialService(HotelSpecialService svc){
		this.hotelSpecialService = svc;
	}

	@RequestMapping("/")
	public String InjectMetadata(ModelMap model, HttpServletRequest request, HttpServletResponse response){
	    System.out.println("IndexController called");
	    model.addAttribute("FlightSpecialList", this.flightSpecialService.findAll());
	    model.addAttribute("HotelSpecialList", this.hotelSpecialService.findAll());
	    
	    return "index";
	}
}
