<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
<meta name="description" content="Dev Lounge - Monoliths to Microservices">
<meta name="author" content="Adam Larter, Developer Solutions Architect, Melbourne Australia">
<link rel="icon" href="resources/images/favicon.ico">
					   
<spring:url value="/resources/css/carousel.css" var="carouselCss" />
<spring:url value="/resources/css/style.css" var="styleCss" />
<spring:url value="/resources/css/bootstrap.min.css" var="bootstrapCss" />
<spring:url value="/resources/js/bootstrap.min.js" var="bootstrapJs" />

<title>TravelBuddy - get traveling!</title>

<link href="${bootstrapCss}" rel="stylesheet">
<link href="${carouselCss}" rel="stylesheet">
<link href="${styleCss}" rel="stylesheet">

</head>
<!-- NAVBAR
================================================== -->
<body>
	<div class="navbar-wrapper">
		<div class="container">

			<nav class="navbar navbar-inverse navbar-static-top">
			<div class="container">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed"
						data-toggle="collapse" data-target="#navbar" aria-expanded="false"
						aria-controls="navbar">
						<span class="sr-only">Toggle navigation</span> <span
							class="icon-bar"></span> <span class="icon-bar"></span> <span
							class="icon-bar"></span>
					</button>
					<a class="navbar-brand" href="#">TravelBuddy</a>
				</div>
				<div id="navbar" class="navbar-collapse collapse">
					<ul class="nav navbar-nav">
						<li class="active"><a href="#">Home</a></li>
						<li><a href="#contact">Contact</a></li>
						<li class="dropdown"><a href="#" class="dropdown-toggle"
							data-toggle="dropdown" role="button" aria-haspopup="true"
							aria-expanded="false">My Activity <span class="caret"></span></a>
							<ul class="dropdown-menu">
								<li><a href="#">Make booking</a></li>
								<li><a href="#">Advanced search</a></li>
								<li><a href="#">My activity statement</a></li>
								<li role="separator" class="divider"></li>
								<li class="dropdown-header">Shopping cart</li>
								<li><a href="#">Show cart</a></li>
								<li><a href="#">Buy all in cart</a></li>
							</ul></li>
					</ul>
				</div>
			</div>
			</nav>

		</div>
	</div>


	<!-- Carousel
    ================================================== -->
	<div id="myCarousel" class="carousel slide" data-ride="carousel">
		<!-- Indicators -->
		<ol class="carousel-indicators">
			<li data-target="#myCarousel" data-slide-to="0" class="active"></li>
			<li data-target="#myCarousel" data-slide-to="1"></li>
			<li data-target="#myCarousel" data-slide-to="2"></li>
		</ol>
		<div class="carousel-inner" role="listbox">
			<div class="item active">
				<img class="first-slide" src="resources/images/IMG_0721.JPG"
					alt="First slide">
				<div class="container">
					<div class="carousel-caption">
						<h1 class="dymo">
							Red Hot<br>destinations
						</h1>
						<br>
						<p class="dymo">Discover the best Hawaii has to offer with
							this all inclusive 28 day tour</p>
						<p>
							<a class="btn btn-lg btn-primary button-gap" href="#"
								role="button">Find out more</a>
						</p>
					</div>
				</div>
			</div>
			<div class="item">
				<img class="second-slide" src="resources/images/IMG_2199.JPG"
					alt="Second slide">
				<div class="container">
					<div class="carousel-caption">
						<h1 class="dymo">
							Alpaca<br>your bags!
						</h1>
						<br>
						<p class="dymo">
							You're off to South America on a 21 day adventure,<br>taking
							in all the best Peru has to offer
						</p>
						<p>
							<a class="btn btn-lg btn-primary button-gap" href="#"
								role="button">Tell me more</a>
						</p>
					</div>
				</div>
			</div>
			<div class="item">
				<img class="third-slide" src="resources/images/IMG_2428.JPG"
					alt="Third slide">
				<div class="container">
					<div class="carousel-caption">
						<h1 class="dymo">
							Discover<br>Argentina
						</h1>
						<br>
						<p class="dymo">
							From Buenos Aires to the Iguazu Falls,<br>Argentina will
							surprise and delight.
						</p>
						<p>
							<a class="btn btn-lg btn-primary button-gap" href="#"
								role="button">Discover Argentina</a>
						</p>
					</div>
				</div>
			</div>
		</div>
		<a class="left carousel-control" href="#myCarousel" role="button"
			data-slide="prev"> <span class="glyphicon glyphicon-chevron-left"
			aria-hidden="true"></span> <span class="sr-only">Previous</span>
		</a> <a class="right carousel-control" href="#myCarousel" role="button"
			data-slide="next"> <span
			class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
			<span class="sr-only">Next</span>
		</a>
	</div>
	<!-- /.carousel -->


	<div class="container marketing">
		<div class="row block flightdestinationblock">
			<div class="col-md-6">
				<h2>Today's flight specials</h2>
				<c:forEach items="${FlightSpecialList}" var="item">
					<div class="flightspecialbox">
						<table border=0 width=100% cellspacing=5>
							<tr>
								<td class="flighticon-urgent" width=40><span
									class="glyphicon glyphicon-send flighticon flighticon-urgent"
									aria-hidden="true"></span></td>
								<td class=flightdestination width=400>${item.header}<br>
								<span class=flightdescription>${item.body}</span></td>
								<td><span class="flightprice">$${item.cost}</span></td>
								<td width=200>
								<span class="flighttime pull-right" data-expiry="${item.expiryDate}"></span></td>
							</tr>

						</table>
					</div>
				</c:forEach>
			</div>

			<div class="col-md-6">
				<h2>Today's hotel specials</h2>
				<c:forEach items="${HotelSpecialList}" var="item">
					<div class="flightspecialbox">
						<table border=0 width=100% cellspacing=5>
							<tr>
								<td class="flighticon" width=40><span
									class="glyphicon glyphicon-send flighticon"
									aria-hidden="true"></span></td>
								<td class=flightdestination width=400>${item.hotel} - ${item.location}<br>
								<span class=flightdescription>${item.description}</span></td>
								<td><span class="flightprice">$${item.cost}</span></td>
								<td width=200>
								<span class="flighttime pull-right" data-expiry="${item.expiryDate}"></span></td>
							</tr>

						</table>
					</div>
				</c:forEach>			
			</div>

		</div>


		<!-- Three columns of text below the carousel -->
		<div class="row">
			<div class="col-lg-4">
				<img class="img-circle" src="resources/images/IMG_0721.JPG"
					alt="Generic placeholder image" width="140" height="140">
				<h2>Hawaii</h2>
				<p>Great Deals on Flights &amp; Hotels. Book a Package to
					Hawaii. Spa Holidays, Family Holidays, Luxury Holidays, Very Cheap
					Holidays, All Inclusive Holidays.</p>
				<p>
					<a class="btn btn-default" href="#" role="button">I want to go!  &raquo;</a>
				</p>
			</div>
			<!-- /.col-lg-4 -->
			<div class="col-lg-4">
				<img class="img-circle" src="resources/images/IMG_0485.JPG"
					alt="Generic placeholder image" width="140" height="140">
				<h2>Egypt</h2>
				<p>Duis mollis, est non commodo luctus, nisi erat porttitor
					ligula, eget lacinia odio sem nec elit. Cras mattis consectetur
					purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo,
					tortor mauris condimentum nibh.</p>
				<p>
					<a class="btn btn-default" href="#" role="button">Sounds awesome!  &raquo;</a>
				</p>
			</div>
			<!-- /.col-lg-4 -->
			<div class="col-lg-4">
				<img class="img-circle" src="resources/images/IMG_1838.JPG"
					alt="Generic placeholder image" width="140" height="140">
				<h2>New York</h2>
				<p>Donec sed odio dui. Cras justo odio, dapibus ac facilisis in,
					egestas eget quam. Vestibulum id ligula porta felis euismod semper.
					Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum
					nibh, ut fermentum massa justo sit amet risus.</p>
				<p>
					<a class="btn btn-default" href="#" role="button">Book me, already!  &raquo;</a>
				</p>
			</div>
			<!-- /.col-lg-4 -->
		</div>
		<!-- /.row -->

		<!-- START THE FEATURETTES -->

		<hr class="featurette-divider">

		<div class="row featurette">
			<div class="col-md-7">
				<h2 class="featurette-heading">
					Lady Liberty Awaits. <span class="text-muted">New York, New York!.</span>
				</h2>
				<p class="lead">Donec ullamcorper nulla non metus auctor
					fringilla. Vestibulum id ligula porta felis euismod semper.
					Praesent commodo cursus magna, vel scelerisque nisl consectetur.
					Fusce dapibus, tellus ac cursus commodo. Donec ullamcorper nulla non metus auctor
					fringilla. Vestibulum id ligula porta felis euismod semper.
					Praesent commodo cursus magna, vel scelerisque nisl consectetur.
					Fusce dapibus, tellus ac cursus commodo.</p>
			</div>
			<div class="col-md-5">
				<img class="featurette-image img-responsive center-block"
					src="resources/images/IMG_1838.JPG">
			</div>
		</div>

		<hr class="featurette-divider">

		<div class="row featurette">
			<div class="col-md-7 col-md-push-5">
				<h2 class="featurette-heading">
					Natural Wonders. <span class="text-muted">Hawaii at its very best.</span>
				</h2>
				<p class="lead">Donec ullamcorper nulla non metus auctor
					fringilla. Vestibulum id ligula porta felis euismod semper.
					Praesent commodo cursus magna, vel scelerisque nisl consectetur.
					Fusce dapibus, tellus ac cursus commodo. Donec ullamcorper nulla non metus auctor
					fringilla. Vestibulum id ligula porta felis euismod semper.
					Praesent commodo cursus magna, vel scelerisque nisl consectetur.
					Fusce dapibus, tellus ac cursus commodo.</p>
			</div>
			<div class="col-md-5 col-md-pull-7">
				<img class="featurette-image img-responsive center-block"
					src="resources/images/IMG_0721.JPG">
			</div>
		</div>

		<hr class="featurette-divider">

		<div class="row featurette">
			<div class="col-md-7">
				<h2 class="featurette-heading">
					Simply Unforgettable. <span class="text-muted">Period.</span>
				</h2>
				<p class="lead">Fusce dapibus, tellus ac cursus commodo. Donec ullamcorper nulla non metus auctor
					fringilla. Vestibulum id ligula porta felis euismod semper.
					Praesent commodo cursus magna, vel scelerisque nisl consectetur.
					Fusce dapibus, tellus ac cursus commodo. Donec ullamcorper nulla non metus auctor
					fringilla. Vestibulum id ligula porta felis euismod semper.
					Praesent commodo cursus magna, vel scelerisque nisl consectetur.
					Fusce dapibus, tellus ac cursus commodo. Donec ullamcorper nulla non metus auctor
					fringilla. Vestibulum id ligula porta felis euismod semper.</p>
			</div>
			<div class="col-md-5">
				<img class="featurette-image img-responsive center-block"
					src="resources/images/IMG_0485.JPG"> 
			</div>
		</div>

		<hr class="featurette-divider">

		<!-- /END THE FEATURETTES -->

		<img style="margin-bottom:20px" src="qrcodegen/150/DevLounge%20-%20Microservices%20to%20Monoliths!" width=150 height=150>

		<!-- FOOTER -->
		<footer>
		<p class="pull-right">
			<a href="#">Back to top</a>
		</p>
		<p>
			&copy; 2017 TravelBuddy, Inc. &middot; <a href="#">Privacy</a> &middot; <a
				href="#">Terms</a>
		</p>
		</footer>

	</div>
	<!-- /.container -->


	<!-- Bootstrap core JavaScript
    ================================================== -->
	<!-- Placed at the end of the document so the pages load faster -->
	<script
		src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
	<script>window.jQuery || document.write('<script src="../../assets/js/vendor/jquery.min.js"><\/script>')</script>
	<script src="${bootstrapJs}"></script>
	
	<script src="resources/js/index.js"></script>

</body>
</html>

