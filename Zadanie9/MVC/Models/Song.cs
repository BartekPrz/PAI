using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace MVC.Models
{
    public class Song
    {
        [Required(ErrorMessage = "Name is required!")]
        [StringLength(100, ErrorMessage = "Maximal length of the name of a song is 100 characters!")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Artist field is required!")]
        [StringLength(50, ErrorMessage = "Maximal length of the name of an artist is 50 characters!")]
        public string Artist { get; set; }
        public int GenreId { get; set; }
        public int Id { get; set; }
    }
}