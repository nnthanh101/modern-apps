package devlounge.spring.dao;

import java.util.List;

import devlounge.spring.model.FlightSpecial;

public interface FlightSpecialDAO {

	public List<FlightSpecial> findAll();
	public FlightSpecial findById(int id);
}
