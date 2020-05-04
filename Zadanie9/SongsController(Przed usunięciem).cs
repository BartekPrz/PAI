using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MVC.Models;

namespace MVC.Controllers
{
    public class SongsController : Controller
    {
        // GET: Songs
        public ActionResult Index()
        {
            Song song = new Song();
            song.Name = "Shape of You";
            song.Artist = "Ed Sheeran";
            song.Genre = "POP";
            song.Id = 1;
            return View(song);
        }

        //GET id squared
        public ActionResult Square(int id)
        {
            return Content(Math.Pow(id, 2).ToString());
        }
    }
}