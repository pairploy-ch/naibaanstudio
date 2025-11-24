export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Contact */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">Contact</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>Tel: 348 554 3333</p>
              <p>Email: hello@thaiflavors.com</p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">Hours</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>Monday - Sunday</p>
              <p>8:00 am - 10:00 pm</p>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">Location</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>No. 235 Niam Niam St, Phraya,</p>
              <p>Soi 108, Bangkok 10400, Thailand</p>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="w-full h-96 bg-muted rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248057.87157287376!2d100.41992764999998!3d13.724544449999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d6032280d61f3%3A0x10100b25de24820!2sBangkok%2C%20Thailand!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t py-6">
        <p className="text-center text-muted-foreground text-sm">
          Copyright Thai Flavors 2025
        </p>
      </div>
    </footer>
  )
}
