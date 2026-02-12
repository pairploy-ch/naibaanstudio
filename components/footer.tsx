export function Footer() {
  return (
    <footer className="bg-[#F6EFE7">
      <div className="container max-w-[90%] mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Contact */}
          <div>
            <h3 className=" text-2xl font-bold mb-4">Contact</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>
                <u>Tel: 0926100542, 0941656352</u>
              </p>

              <p>
                <u>Email: info@naibaanstudio.com</u>
              </p>
            </div>
          </div>

          {/* Hours */}
          <div style={{ justifySelf: "center" }}>
            <h3 className=" text-2xl font-bold mb-4">Hours</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>Monday – Sunday (close on Wednesday)</p>
              <p>9.00 a.m. - 5.30 p.m.</p>
            </div>
          </div>

          {/* Location */}
          <div style={{ justifySelf: "right" }}>
            <h3 className=" text-2xl font-bold mb-4">Location</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>2nd floor 230 Nares Road, Si Phraya,</p>
              <p>Bang Rak, Bangkok 10500, Thailand</p>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="w-full h-96 bg-muted rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.834112439908!2d100.52374499999999!3d13.728491199999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e299004d4ab939%3A0xf672d0e1245ec4cb!2sNaibaan%20Studio!5e0!3m2!1sth!2sth!4v1770735032110!5m2!1sth!2sth"
            width="100%"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Copyright */}
      <div className="py-6 bg-[#363522] text-white" >
        <div className="max-w-[90%] mx-auto" style={{display: 'flex', justifyContent: 'space-between'}}>
  <p className="text-white text-sm">
          Copyright © 2025 naibaanstudio.com All rights reserved.
        </p>
        <div>
          <a href="/policy" className="mr-3" style={{fontSize: '12px'}}>Privacy Policy</a>
          <a href="/terms" className="mr-3" style={{fontSize: '12px'}}>Terms and Conditions</a>
          <a href="/refund" style={{fontSize: '12px'}}>Refund & Cancellation Policy</a>
        </div>
        </div>

      
      </div>
    </footer>
  );
}
