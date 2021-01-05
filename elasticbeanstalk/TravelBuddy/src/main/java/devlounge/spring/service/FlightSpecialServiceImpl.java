package devlounge.spring.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import devlounge.spring.dao.FlightSpecialDAO;
import devlounge.spring.model.FlightSpecial;

@Service
public class FlightSpecialServiceImpl implements FlightSpecialService {
	
	private FlightSpecialDAO flightspecialDAO;

	
	private FlightSpecialDAO getFlightspecialDAO() {
		return flightspecialDAO;
	}

	public void setFlightspecialDAO(FlightSpecialDAO flightspecialDAO) {
		this.flightspecialDAO = flightspecialDAO;
	}

	@Override
	@Transactional
	public List<FlightSpecial> findAll() {
		return this.getFlightspecialDAO().findAll();
	}

	@Override
	@Transactional
	public FlightSpecial findById(int id) {
		return this.getFlightspecialDAO().findById(id);
	}

}
