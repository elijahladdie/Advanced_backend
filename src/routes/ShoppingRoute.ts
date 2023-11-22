import express from 'express';
import { GetFoodAvailability, GetFoodsIn30Min, GetTopRestaurant, RestaurantById, SearchFood } from '../controllers';

const router = express.Router();

/**  -----------------------Food availability --------------- */
router.get('/:pincode',GetFoodAvailability);

/**  ----------------------- Top Restaurent  --------------- */
router.get('/top-restaurant/:pincode',GetTopRestaurant);


/**  ----------------------- Food available in 30 min  --------------- */
router.get('/foods-in-30-min/:pincode',GetFoodsIn30Min);


/**  ----------------------- Search Food  --------------- */
router.get('/search/:pincode',SearchFood);


/**  ----------------------- Find restaurent by id  --------------- */
router.get('/restaurant/:id',RestaurantById);






export {router as ShoppingRoute}