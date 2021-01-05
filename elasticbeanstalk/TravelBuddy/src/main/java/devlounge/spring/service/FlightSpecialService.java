package devlounge.spring.service;

import java.util.List;

import devlounge.spring.model.FlightSpecial;

public interface FlightSpecialService {

	public List<FlightSpecial> findAll();
	public FlightSpecial findById(int id);
	
}
