package devlounge.spring.dao;

import java.util.Date;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.AWSXRay;
import com.amazonaws.xray.entities.Segment;
import com.amazonaws.xray.entities.Subsegment;

import devlounge.spring.Utilities;
import devlounge.spring.model.FlightSpecial;

@Repository
public class FlightSpecialDAOImpl implements FlightSpecialDAO {

	private static final Logger logger = LoggerFactory.getLogger(FlightSpecialDAOImpl.class);

	private SessionFactory sessionFactory;

	public void setSessionFactory(SessionFactory sf) {
		this.sessionFactory = sf;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<FlightSpecial> findAll() {
		Date now = new Date();
		Session session = this.sessionFactory.getCurrentSession();
		List<FlightSpecial> itemList = session
				.createQuery("from FlightSpecial where expiryDate > " + now.getTime() + " order by expiryDate").list();
		for (FlightSpecial item : itemList) {
			logger.info("Item::" + item);
		}
		return itemList;
	}

	@Override
	public FlightSpecial findById(int id) {
		Session session = this.sessionFactory.getCurrentSession();
		FlightSpecial item = (FlightSpecial) session.load(FlightSpecial.class, new Integer(id));
		logger.info("Item loaded successfully, details=" + item);
		return item;
	}
}
